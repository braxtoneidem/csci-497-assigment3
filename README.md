# csci-497-assigment3

# GROUP 5 MEMBERS
Braxton Eidem
Frank Robinson

# LINK TO ALB
https://assignment3-1111578728.us-west-2.elb.amazonaws.com:443/

# CHALLENGES
By far our biggest challenge was storing posts using DynamoDB. It took us quite a while to figure out how to connect to our DynamoDB table alongside our MongoDB connection. We spent hours trying to use dynamoose: we thought it would be easier since the app was previously using mongoose, and dynamoose is meant to sort of mimick mongoose features. However, we could not find proper examples of  dynamoose being used to suit our needs, so instead we moved to using aws-sdk functions. We used the aws DynamoDB node.js tutorials consistently for referencing how to read and write to our table.

When attempting to pass our items from our DynamoDB table to the Home page of the web app, the ejs file that was parsing the attributes was not accepting the results of our DynamoDB query. So, we resorted to replicating all of the table items into an array and then  passing that array using render. We had trouble with our array being passed before it was filled due to the nature of js. We couldn't figure out how to use promises to prevent this, so we resorted to using setTimeout().

# BUGGY FEATURES

Replicating our table items into an array and using a timeout every time we load the home page is not ideal.
We tried using promises but were unable to get passed errors and complications with passing parameters between functions.