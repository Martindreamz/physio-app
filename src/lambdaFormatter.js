const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB()

exports.handler = async (event) => {
    //----------------------------- Start Validate Input Response -----------------------------
    let deleteId = 0;
    deleteId = parseInt(event['deleteId'])
    console.log("ID received: " + deleteId);

    let responseCode = 200;
    console.log("request: " + JSON.stringify(event));

    if (event.queryStringParameters && event.queryStringParameters.deleteId) {
        console.log("Received Id: " + event.queryStringParameters.deleteId);
        deleteId = parseInt(event.queryStringParameters.deleteId);
    }
    //----------------------------- End Validate Input Response -----------------------------

    //----------------------------- Start Validate ID Exist -----------------------------
    var DeleteBoookingParams = {
        TableName: "Bookings", // The name of your DynamoDB table
        Key: { ID: deleteId }
    }

    const validateDeleteBookingResponse = await documentClient.get(DeleteBoookingParams).promise();
    console.log("validate", validateDeleteBookingResponse)

    let deleteSuccessful = false;
    if (validateDeleteBookingResponse.Item == null) {
        console.log("not found")
    } else deleteSuccessful = true;
    //----------------------------- End Validate ID Exist -----------------------------

    //----------------------------- Start Get Existing Booking Counts -----------------------------
    let BookingCountParams = {
        TableName: "TableCounter",
        Key: { TableName: "Bookings" }
    }

    let BookingCountResponse = await documentClient.get(BookingCountParams).promise();
    //----------------------------- End Get Existing Booking Counts -----------------------------

    //----------------------------- Start Deleting Booking -----------------------------
    let responseBody = {}

    console.log("deleteSuccessful", deleteSuccessful)
    if (deleteSuccessful) {
        let deleteBookingResponse = await documentClient.delete(DeleteBoookingParams).promise();
        console.log("delete", deleteBookingResponse)
    //----------------------------- End Deleting Booking -----------------------------

    //----------------------------- Start Updating Booking Counts -----------------------------
        let Item = {
            TableName: "Bookings",
            Counter: BookingCountResponse.Item.Counter - 1
        }
        const updateCounterParams = {
            TableName: 'TableCounter',
            Item
        }
        let NewBookingCountResponse = await documentClient.put(updateCounterParams).promise();
    //----------------------------- End Updating Booking Counts -----------------------------

    //----------------------------- Start Output Response -----------------------------
        responseBody = {
            oldBookingCount: BookingCountResponse.Item.Counter,
            BookingDeleted: validateDeleteBookingResponse,
            newBookingCount: BookingCountResponse.Item.Counter - 1,
        };
    } else {

        responseBody = {
            oldBookingCount: BookingCountResponse.Item.Counter,
            BookingDeleted: "Nothing Deleted",
            newBookingCount: BookingCountResponse.Item.Counter,
        };
    }

    let response = {
        statusCode: responseCode,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body:JSON.stringify(responseBody)

    };
    // console.log("response: " + JSON.stringify(response))
    return response;
    //----------------------------- End Output Response -----------------------------

};
