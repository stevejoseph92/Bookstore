# Bookstore
Repo for Gainbridge assignment

## Description
Tests are written with Playwright and typescript. CRUD endpoints are tested individually but also combined into workflows when possible (ex/add book,get it,then delete) to test comprehensively. Using workflows when applicable is time and cost efficient and more accurate to user journeys. Tests were written to be isolated so they can be run independently and in parallel. 

Tests validate response code and response body content. Tests may use JSON files for parameters/body of a request and also be used to validate the response body. This may be mock data or match already existing database entries. Depending on context, in particular load testing, we may want to mock a larger dataset for this purpose or create a data generator.

## Load Testing

For load testing we can use tools such as JMeter or k6.io. 

Scripts should test scenarios such as the workflows described in the playwright tests. Endpoints should also be tested individually. Although we should know what common traffic patters are to load test properly, the GET endpoints are likely to be used heavily and should be emphasized with stress and spike testing. Average load tests should give us a baseline and smoke tests should validate test script errors before executing larger tests. More critical/common workflows should have spike testing.

Tests should use realistic mock data and be randomized to ensure variability in requests.

Depending on the environment tests are being run against, we should adjust frequency and type of tests. Staging environments should be as close to production as possible and be updated with the latest changes, making it suitable for assessing performance changes like performance trends, regressions, or improvements. It may be appropriate to run frequent smoke tests in production for synthetic testing. 