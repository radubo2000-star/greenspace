#!/bin/bash

# Script pentru testarea CORS pe backend

echo "🔍 Testare CORS pentru Asociația Green Space"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKEND_URL="https://api.asociatiagreenspace.ro"
FRONTEND_URL="https://asociatiagreenspace.ro"

echo "📍 Backend URL: $BACKEND_URL"
echo "📍 Frontend URL: $FRONTEND_URL"
echo ""

# Test 1: Health check
echo "Test 1: Health Check"
echo "--------------------"
HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend is reachable${NC}"
    echo "Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Backend is not reachable${NC}"
fi
echo ""

# Test 2: CORS preflight (OPTIONS request)
echo "Test 2: CORS Preflight (OPTIONS)"
echo "--------------------------------"
CORS_HEADERS=$(curl -s -I -X OPTIONS "$BACKEND_URL/health" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type")

if echo "$CORS_HEADERS" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✅ CORS headers present${NC}"
    echo "$CORS_HEADERS" | grep "Access-Control"
else
    echo -e "${RED}❌ CORS headers missing${NC}"
    echo "Full response:"
    echo "$CORS_HEADERS"
fi
echo ""

# Test 3: Actual POST request with CORS
echo "Test 3: POST Request with CORS"
echo "-------------------------------"
POST_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BACKEND_URL/analytics/page-view" \
    -H "Origin: $FRONTEND_URL" \
    -H "Content-Type: application/json" \
    -d '{"page":"/test","timestamp":"2024-01-01T00:00:00.000Z"}')

HTTP_CODE=$(echo "$POST_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
RESPONSE_BODY=$(echo "$POST_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✅ POST request successful (HTTP $HTTP_CODE)${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ POST request failed (HTTP $HTTP_CODE)${NC}"
    echo "Response: $RESPONSE_BODY"
fi
echo ""

# Test 4: Check specific CORS headers
echo "Test 4: Detailed CORS Headers Check"
echo "------------------------------------"
DETAILED_HEADERS=$(curl -s -I "$BACKEND_URL/health" -H "Origin: $FRONTEND_URL")

check_header() {
    HEADER_NAME=$1
    if echo "$DETAILED_HEADERS" | grep -qi "$HEADER_NAME"; then
        HEADER_VALUE=$(echo "$DETAILED_HEADERS" | grep -i "$HEADER_NAME" | cut -d: -f2- | tr -d '\r')
        echo -e "${GREEN}✅ $HEADER_NAME:$HEADER_VALUE${NC}"
    else
        echo -e "${RED}❌ $HEADER_NAME: Missing${NC}"
    fi
}

check_header "Access-Control-Allow-Origin"
check_header "Access-Control-Allow-Methods"
check_header "Access-Control-Allow-Headers"
check_header "Access-Control-Allow-Credentials"
echo ""

# Test 5: Test from www subdomain
echo "Test 5: CORS from www subdomain"
echo "--------------------------------"
WWW_CORS=$(curl -s -I "$BACKEND_URL/health" -H "Origin: https://www.asociatiagreenspace.ro")

if echo "$WWW_CORS" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✅ CORS works from www subdomain${NC}"
else
    echo -e "${YELLOW}⚠️  CORS might not work from www subdomain${NC}"
fi
echo ""

# Summary
echo "📊 Summary"
echo "=========="
echo ""
echo "If all tests show ✅, CORS is configured correctly!"
echo "If you see ❌, check the following:"
echo "  1. Make sure server.js has been updated and uploaded"
echo "  2. Make sure .htaccess has been updated and uploaded"
echo "  3. Restart the Node.js application (Passenger)"
echo "  4. Check if mod_headers is enabled in Apache"
echo "  5. Clear browser cache and try again"
echo ""
echo "For detailed instructions, see: FIX-CORS-ERROR.md"
