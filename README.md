# Bookstore
Repo for Gainbridge assignment

## Description
Tests are written with Playwright and typescript. CRUD endpoints are tested individually but also combined into workflows when possible (ex/add book,get it,then delete) to test comprehensively. Using workflows when applicable is time and cost efficient and more accurate to user journeys. Tests were written to be isolated so they can be run independently and in parallel. 

Tests validate response code and response body content. Tests may use JSON files for parameters/body of a request and also be used to validate the response body. This may be mock data or match already existing database entries. Depending on context, in particular load testing, we may want to mock a larger dataset for this purpose or create a data generator.

## Load Testing

For load testing we can use tools such as JMeter or k6.io. Scripts should test key scenarios such as the workflow described in the playwright tests. Endpoints should also be tested individually. This should cover realistic user behavior. The GET endpoints are most likely to be used more heavily and should be emphasized. Tests should use realistic mock data and be randomized to ensure variability in requests.