API_URL="http://api-test.got.co.th/inventory/getItems"

# Define Bearer Token
BEARER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnb3QtdmVyaWZ5LmNvLnRoIiwidXNlcm5hbWUiOiJ1c2VyIn0.-ZXstq9HJ4x2OqomBG2GQGkHkbjfykSQXhYhZjtdY8Q"

# Number of requests to make
NUM_REQUESTS=6

# Loop through the number of requests
i=1
while [ $i -le $NUM_REQUESTS ]
do
    echo "Making request #$i..."

    # Make the curl request and capture response body and status code
    response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL" \
        -H "Authorization: Bearer $BEARER_TOKEN" \
        -H "Content-Type: application/json")

    # Separate the response body and the HTTP status code
    body=$(echo "$response" | head -n -1)
    status_code=$(echo "$response" | tail -n 1)

    # Check the HTTP status code
    if [ "$status_code" -eq 200 ]; then
        echo "Request #$i: Success"
        echo "Response Body:"
        echo "$body"
    else
        echo "Request #$i: Failed with status code $status_code"
        echo "Response Body:"
        echo "$body"
    fi

    sleep 1
    
    i=$((i + 1))
done

exit 0
