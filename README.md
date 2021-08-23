# Image Upload Demo

Process images with ImageMagick lambda layer:

https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:145266761615:applications~image-magick-lambda-layer

## Requirements

### The API must be written using Nodejs.

**DONE**

### Use serverless framework

**DONE**

### The API must be deployable to **AWS Lambda** (use free AWS account).

**DONE** `npm run deploy`

### The images must be stored into AWS S3 (you can either create a free aws account or use localstack).

**DONE** **Update the bucket name in serverless**

### Think about security while developing your APIs (it's impossible to have a system 100% secure).

Lambda authorizer implemented. This should've used AWS cognito, but cognito setup time is extensive so I implemented a basic dummy authorizer. To authorize HTTP calls
you can use `"CustomAuth": "demo"` header

### Create a GitHub repository with your project.

**DONE**

### Documentation

**DONE** see README.md

### Unit or Integration Tests

I did not have time for this. I would configure this with `mocha` and use `sinon` for mocking out dependencies. This requires rework of the code and is more involved than something I can do in a limited amount of time. I would also run tests on commit to ensure bugs are caught before it reaches master.

### Extract image metadata (EXIF, IPTC) using image magick (https://imagemagick.org/script/identify.php).

**DONE** uses a lambda layer that must be implemented and specified with the `IMAGE_MAGICK_LAYER_ARN` env variable

### Store the extracted metadata as a JSON file in the same S3 location the image was saved.

**DONE** I would do this by hooking into S3 events rather, have the processing in a different lambda function. Time limited this

### Expose a User API to Register and Login system users.

To do this properly would require more time. I would use a service such as **AWS cognito**, but they already provide their own APIs. Would have to set up the correct oAuth flow and define resource server with scopes. If not, would have to rely on an oAuth flow on the front end. Having a user pass username/password to an API is not a good idea, so would rather rely on the **JWT tokens** provided by cognito.

### Use of public layers (where necessary)

https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:145266761615:applications~image-magick-lambda-layer


## How to run

The stack can be deployed to a free **AWS account**. I would suggest not using `serverless-offline` as it seems to not play well with custom authorizers.

You must create the lambda layer and specify it with the correct env variable mentioned above. Ideally this layer should be created and deployed with the repo.

You must also specify your own bucket name in serverless.

You can then `POST` to `/upload` with the image file (binary in Postman). The method expects Base64 encoded image, Postman does this by default.