import sys
import requests
from urllib.parse import urlparse, urljoin
from concurrent.futures import ThreadPoolExecutor, as_completed

# ============================================================
# CONFIG
# ============================================================

TIMEOUT = 8

PASS = 0
FAIL = 0

session = requests.Session()

session.headers.update({
    "User-Agent": "Security-Test/1.0"
})


# ============================================================
# TEST RESULT
# ============================================================

def test(name, condition, detail=""):

    global PASS, FAIL

    if condition:

        PASS += 1

        print(f"[PASS] {name}")

    else:

        FAIL += 1

        print(
            f"[FAIL] {name}"
            + (f" -> {detail}" if detail else "")
        )


# ============================================================
# REQUEST
# ============================================================

def send(
    method,
    url,
    **kwargs
):

    try:

        kwargs.setdefault(
            "timeout",
            TIMEOUT
        )

        return session.request(
            method,
            url,
            **kwargs
        )

    except requests.RequestException:

        return None


# ============================================================
# 1. HEALTH / BASIC
# ============================================================

def test_01_basic(url):

    r = send(
        "GET",
        url
    )

    test(
        "Health / Basic endpoint",
        r is not None and r.status_code < 500,
        "Serverga ulanish yoki server xatosi"
    )

    return r


# ============================================================
# 2. JWT / AUTH
# ============================================================

def test_02_jwt(url):

    paths = [
        "/auth/me",
        "/api/auth/me",
        "/me",
        "/api/me",
    ]

    found = False

    for path in paths:

        r = send(
            "GET",
            urljoin(
                url + "/",
                path.lstrip("/")
            )
        )

        if r is None:
            continue

        if r.status_code in (401, 403):

            found = True
            break

    test(
        "JWT: tokensiz kirish bloklandi",
        found,
        "Himoyalangan endpoint topilmadi yoki 401/403 qaytmadi"
    )


# ============================================================
# 3. INVALID JWT
# ============================================================

def test_03_invalid_jwt(url):

    paths = [
        "/auth/me",
        "/api/auth/me",
        "/me",
        "/api/me",
    ]

    found = False

    for path in paths:

        r = send(
            "GET",
            urljoin(
                url + "/",
                path.lstrip("/")
            ),
            headers={
                "Authorization": "Bearer invalid_test_token"
            }
        )

        if r is None:
            continue

        if r.status_code == 401:

            found = True
            break

    test(
        "JWT: noto'g'ri token bloklandi",
        found,
        "401 qaytmadi"
    )


# ============================================================
# 4. CORS
# ============================================================

def test_04_cors(url):

    r = send(
        "OPTIONS",
        url,
        headers={
            "Origin": "https://evil.example",
            "Access-Control-Request-Method": "GET",
        }
    )

    if r is None:

        test(
            "CORS: noma'lum origin",
            False,
            "OPTIONS request bajarilmadi"
        )

        return

    allow_origin = r.headers.get(
        "Access-Control-Allow-Origin",
        ""
    )

    test(
        "CORS: noma'lum origin",
        allow_origin != "https://evil.example",
        f"Allow-Origin: {allow_origin}"
    )


# ============================================================
# 5. X-CONTENT-TYPE-OPTIONS
# ============================================================

def test_05_content_type(r):

    if r is None:

        test(
            "Security header: X-Content-Type-Options",
            False
        )

        return

    value = r.headers.get(
        "X-Content-Type-Options",
        ""
    ).lower()

    test(
        "Security header: X-Content-Type-Options",
        value == "nosniff",
        f"Topildi: {value or 'yoq'}"
    )


# ============================================================
# 6. X-FRAME-OPTIONS
# ============================================================

def test_06_frame(r):

    if r is None:

        test(
            "Security header: X-Frame-Options",
            False
        )

        return

    value = r.headers.get(
        "X-Frame-Options",
        ""
    ).upper()

    test(
        "Security header: X-Frame-Options",
        value in (
            "DENY",
            "SAMEORIGIN"
        ),
        f"Topildi: {value or 'yoq'}"
    )


# ============================================================
# 7. REFERRER POLICY
# ============================================================

def test_07_referrer(r):

    if r is None:

        test(
            "Security header: Referrer-Policy",
            False
        )

        return

    value = r.headers.get(
        "Referrer-Policy",
        ""
    )

    test(
        "Security header: Referrer-Policy",
        bool(value),
        f"Topildi: {value or 'yoq'}"
    )


# ============================================================
# 8. PERMISSIONS POLICY
# ============================================================

def test_08_permissions(r):

    if r is None:

        test(
            "Security header: Permissions-Policy",
            False
        )

        return

    value = r.headers.get(
        "Permissions-Policy",
        ""
    )

    test(
        "Security header: Permissions-Policy",
        bool(value),
        f"Topildi: {value or 'yoq'}"
    )


# ============================================================
# 9. CSP
# ============================================================

def test_09_csp(r):

    if r is None:

        test(
            "Security header: Content-Security-Policy",
            False
        )

        return

    csp = r.headers.get(
        "Content-Security-Policy",
        ""
    )

    required = [
        "default-src",
        "script-src",
        "style-src",
        "img-src",
        "frame-ancestors",
        "base-uri",
        "form-action",
    ]

    safe = (
        bool(csp)
        and all(
            item in csp
            for item in required
        )
    )

    test(
        "Security header: Content-Security-Policy",
        safe,
        f"CSP: {csp or 'yoq'}"
    )


# ============================================================
# 10. IDOR
# ============================================================

def test_10_idor(url):

    paths = [
        "/users/999999",
        "/api/users/999999",
        "/users/1",
        "/api/users/1",
    ]

    protected = False

    for path in paths:

        r = send(
            "GET",
            urljoin(
                url + "/",
                path.lstrip("/")
            ),
            headers={
                "Authorization": "Bearer invalid_test_token"
            }
        )

        if r is None:
            continue

        if r.status_code in (
            401,
            403
        ):

            protected = True
            break

    test(
        "IDOR: ruxsatsiz user ID bloklandi",
        protected,
        "401/403 topilmadi"
    )


# ============================================================
# 11. ADMIN PROTECTION
# ============================================================

def test_11_admin(url):

    paths = [
        "/admin",
        "/admin/test",
        "/api/admin",
        "/api/admin/test",
    ]

    protected = False

    for path in paths:

        r = send(
            "GET",
            urljoin(
                url + "/",
                path.lstrip("/")
            ),
            headers={
                "Authorization": "Bearer invalid_test_token"
            }
        )

        if r is None:
            continue

        if r.status_code in (
            401,
            403,
            404
        ):

            protected = True
            break

    test(
        "Admin endpoint himoyalangan",
        protected,
        "Admin endpoint 401/403/404 qaytarmadi"
    )


# ============================================================
# 12. SQL INJECTION
# ============================================================

def test_12_sqli(url):

    payload = "' OR '1'='1"

    paths = [
        "/auth/login",
        "/api/auth/login",
        "/login",
        "/api/login",
    ]

    safe = True

    for path in paths:

        endpoint = urljoin(
            url + "/",
            path.lstrip("/")
        )

        r = send(
            "POST",
            endpoint,
            json={
                "username": payload,
                "password": payload,
            }
        )

        if r is None:
            continue

        if r.status_code >= 500:

            safe = False

            break

    test(
        "SQL Injection: basic test",
        safe,
        "Server 5xx qaytardi"
    )


# ============================================================
# 13. XSS
# ============================================================

def test_13_xss(url):

    payload = "<script>alert(1)</script>"

    paths = [
        "/auth/login",
        "/api/auth/login",
        "/login",
        "/api/login",
    ]

    safe = True

    for path in paths:

        endpoint = urljoin(
            url + "/",
            path.lstrip("/")
        )

        r = send(
            "POST",
            endpoint,
            json={
                "username": payload,
                "password": "test123"
            }
        )

        if r is None:
            continue

        if payload.lower() in r.text.lower():

            safe = False

            break

    test(
        "XSS: basic reflection test",
        safe,
        "Payload response ichida qaytdi"
    )


# ============================================================
# 14. PATH TRAVERSAL
# ============================================================

def test_14_path_traversal(url):

    payloads = [
        "/../../etc/passwd",
        "/..%2F..%2Fetc%2Fpasswd",
        "/%2e%2e/%2e%2e/etc/passwd",
    ]

    safe = True

    for path in payloads:

        r = send(
            "GET",
            urljoin(
                url + "/",
                path.lstrip("/")
            )
        )

        if r is None:
            continue

        body = r.text.lower()

        if (
            "root:x:" in body
            or
            "[extensions]" in body
        ):

            safe = False
            break

    test(
        "Path Traversal: basic test",
        safe,
        "Sensitive file content aniqlanishi mumkin"
    )


# ============================================================
# 15. COMMAND INJECTION
# ============================================================

def test_15_command_injection(url):

    payloads = [
        ";whoami",
        "|whoami",
        "&&whoami",
    ]

    paths = [
        "/",
        "/api",
        "/auth/login",
        "/api/auth/login",
    ]

    suspicious = False

    for path in paths:

        endpoint = urljoin(
            url + "/",
            path.lstrip("/")
        )

        for payload in payloads:

            r = send(
                "POST",
                endpoint,
                json={
                    "username": payload,
                    "password": "test"
                }
            )

            if r is None:
                continue

            if r.status_code >= 500:

                suspicious = True
                break

        if suspicious:
            break

    test(
        "Command Injection: basic test",
        not suspicious,
        "5xx response kuzatildi"
    )


# ============================================================
# 16. SSRF
# ============================================================

def test_16_ssrf(url):

    payloads = [
        "http://127.0.0.1",
        "http://localhost",
        "http://169.254.169.254",
    ]

    paths = [
        "/",
        "/api",
        "/auth/login",
        "/api/auth/login",
    ]

    suspicious = False

    for path in paths:

        endpoint = urljoin(
            url + "/",
            path.lstrip("/")
        )

        for payload in payloads:

            r = send(
                "POST",
                endpoint,
                json={
                    "url": payload,
                    "username": payload,
                    "password": "test"
                }
            )

            if r is None:
                continue

            if r.status_code >= 500:

                suspicious = True
                break

        if suspicious:
            break

    test(
        "SSRF: basic test",
        not suspicious,
        "5xx response kuzatildi"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 65)
    print("UNIVERSAL 16-POINT SECURITY TEST")
    print("=" * 65)

    if len(sys.argv) >= 2:

        raw_url = sys.argv[1]

    else:

        raw_url = input(
            "Sayt URL'sini kiriting: "
        )

    raw_url = raw_url.strip()

    if not raw_url.startswith(
        ("http://", "https://")
    ):

        raw_url = "https://" + raw_url

    raw_url = raw_url.rstrip("/")

    parsed = urlparse(raw_url)

    if not parsed.hostname:

        print(
            "[ERROR] URL noto'g'ri."
        )

        return

    print()
    print(
        f"TARGET: {raw_url}"
    )

    print()
    print(
        "Faqat o'zingizga tegishli yoki "
        "ruxsat berilgan tizimlarda ishlating."
    )

    # 1
    response = test_01_basic(
        raw_url
    )

    if response is None:

        print()
        print(
            "Serverga ulanib bo'lmadi."
        )

        return

    # 2
    test_02_jwt(
        raw_url
    )

    # 3
    test_03_invalid_jwt(
        raw_url
    )

    # 4
    test_04_cors(
        raw_url
    )

    # 5
    test_05_content_type(
        response
    )

    # 6
    test_06_frame(
        response
    )

    # 7
    test_07_referrer(
        response
    )

    # 8
    test_08_permissions(
        response
    )

    # 9
    test_09_csp(
        response
    )

    # 10
    test_10_idor(
        raw_url
    )

    # 11
    test_11_admin(
        raw_url
    )

    # 12
    test_12_sqli(
        raw_url
    )

    # 13
    test_13_xss(
        raw_url
    )

    # 14
    test_14_path_traversal(
        raw_url
    )

    # 15
    test_15_command_injection(
        raw_url
    )

    # 16
    test_16_ssrf(
        raw_url
    )

    # ========================================================
    # RESULT
    # ========================================================

    print()
    print("=" * 65)
    print("SECURITY TEST RESULT")
    print("=" * 65)

    print(
        f"PASS: {PASS}"
    )

    print(
        f"FAIL: {FAIL}"
    )

    print()

    if FAIL == 0:

        print(
            "16/16 avtomatik tekshiruv PASS."
        )

    else:

        print(
            f"{FAIL} ta testda muammo yoki "
            f"shubhali holat topildi."
        )

    print("=" * 65)


if __name__ == "__main__":
    main()