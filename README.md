# trumpeter-db
This repo contains all code related to the backend of the Android application Trumpeter. This includes the MongoDB database, Node.js API
and backend, server code, relational data model, and more.

Built by jthaden with Node.js, Express, and Mongoose.

## Main Files:

**```routes.js```:** Home of the REST API. Receives HTTP requests at various routes, facilitating retrieval, update, creation, and
deletion of trumpet and retrumpet data. This file also contains the calls for user account creation and login, done securely with
Passport and methods defined in the Mongoose 'User' model. These account management routes return a JSON web token representing the
current user and session.

**```server.js```:**
Home of main Node server code. Initializes middleware and connects to Mongo database through Mongoose.

**```config/passport.js```:**
Defines the local strategy for Passport, which handles user account authentication. Uses security methods defined under the Mongoose
'User' model to check password validity and returns an answer to the API.

**```models```:**
This directory contains files that define Mongoose schemas for collections in the database and functions that work on the data in those
schemas. ```user.js``` defines ```setPassword``` and ```validPassword```, which use pbkdf2 from Express's Crypto module to generate a 
salt and hash from a given password and test a given password on a user's salt and hash, respectively. Also defined in this file is 
```generateJWT```, which creates a JSON web token for a given user session containing all necessary info about the currently logged in 
user.

**```test```:**
This directory houses Mocha & Chai tests which currently cover basic Trumpet CRUD functionality.


## MongoDB Implementation

Trumpeter utilizes relatively simple logic to create, retrieve, update, and delete data, allowing for an intuitive and lightweight
implementation in non-relational database technology. Support for a non-normalized approach is taken advantage of in Trumpet 
collections, while traditional normalized secondary-key linking is used in User and Retrumpet collections. Additional data model and 
implementation details (types, default values, functions, etc) can be found within Mongoose files for each collection in the 
```models``` directory.

**User documents** contain all user data. Salts and hashes are utilized with Node's built in crypto and pbkdf2 for user 
authentication; no sensitive information is stored in the database. All user documents contain a reference to a unique UserInfo document 
which stores public user data for display on Trumpets. User documents are of varying schemas depending on information provided by the 
user. One per user. 

```
user (
    _id: ObjectId(x), 
    user_info_id: ObjectId(y),
    email_addr: dumbo@gmail.com,
    username: 'BigEars',
    profile_picture: elephant_photo.jpg,
    hash: someHash,
    salt: someSalt
)
```

**UserInfo documents** contain only user information necessary for public display on Trumpets. Copies of a user's UserInfo document 
are embedded in all Trumpet documents posted by that user, and are referenced from a user's User document.

```
user_info (
     _id: ObjectId(x),
     username: 'BigEars',
     profile_picture: elephant_photo.jpg
)
```

**Trumpet documents** are generally represented in this format:

```
trumpet (
     _id: ObjectId(x),
     user_info: (
        _id: ObjectId(x),
        username: 'BigEars',
        profile_picture: elephant_photo.jpg
     },
     reply_trumpet_id: N/A OR ObjectId(r), 
     submit_time: 2/23/2015 11:55:36,
     text: 'I am the coolest elephant',
     likes: 5,
     retrumpets: 2,
     replies: 20
)
```

UserInfo documents are embedded within each Trumpet document, containing only necessary info about the author of the Trumpet. If the 
trumpet is a reply trumpet (was submitted as a reply to another trumpet), the reply_trumpet_id field serves as a reference to the 
trumpet document that is being replied to. Otherwise, this field is not present. Only trumpets that are not replies are queried in the 
main feed of the application. 

**NOTE:** UserInfo documents are embedded within Trumpets to facilitate more efficient retrieval operations for all Trumpets and 
Retrumpets. UserInfo updates are less efficient as a result, but updates of user data are rare.

**Retrumpet documents** are generally represented in this format:

```
retrumpet (
      _id: ObjectId(x),
      trumpet_id: ObjectId(y),
      retrumpeter_username: 'Mr. Elephant'
)
```

A reference to the Trumpet document that is being retrumpeted (reposted) is contained within Retrumpet documents. Retrumpets of both 
regular Trumpets and reply Trumpets are queried in the main feed. A Retrumpet document contains only two additional fields: the unique
id and the username of the user that created the Retrumpet. Retrumpets are up to date with their original Trumpet's data at all times. 

**NOTE:** The Trumpet relationship is normalized (NOT embedded) within Retrumpet documents to facilitate more efficient updating of 
Trumpet data (only required to update one original Trumpet document, and not all of its Retrumpets), and to ensure that updating is an 
atomic operation. Non-normalizing the Retrumpet model, that is, embedding Trumpet data within Retrumpet documents, provides for more 
efficient queries by removing the extra Trumpet lookup from each Retrumpet query. Atomicity and efficiency of update are preferable in 
this case due to the frequency of update operations.



## Relational Data Model (old):
**NOTE:** This data model is outdated and represents the original model design before porting to NoSQL.
Relationally, the database is built around four entities: Users, UserInfo, Trumpets, and ReTrumpets. Trumpet entities can also be split
into two separate categories: Trumpets and ReplyTrumpets. The diagram below contains additional details regarding types and relations.

<a href="url"><img src="http://i.imgur.com/eKtoAY0.png"></a>
*Note: Many details in this diagram are outdated; treat it as a general picture of the model and its relationships. Refer to Mongo 
implementation for current attribute details*


**User entities** in the system possess 6 attributes: 5 required, 1 optional: 
* user_id (PK)
* user_info_id (FK)
* email_addr
* username 
* password
* profile_picture (nullable)

**UserInfo entities** in the system possess 3 attributes: 2 required, 1 optional:
* user_info_id (PK)
* username
* profile_picture (nullable)

**Trumpet entities** have 8 attributes: 7 required, 1 optional:
* trumpet_id (PK)
* user_info_id (FK)
* reply_trumpet_id (FK) (nullable)
* submit_time
* text
* likes
* retrumpets
* replies

**Retrumpet entities** have only 3 attributes: 2 required, 1 optional:
* retrumpet_id (PK)
* trumpet_id (FK)
* retrumpeter_username

**Users** currently contain only basic account management information.

**UserInfo** contain only user information necessary for public display on Trumpets.

**Trumpets** contain a foreign key reference to the posting user under user_id. Additionally, if the Trumpet is a reply Trumpet (that
is, it was submitted as a reply to another Trumpet), it will contain a foreign key reference to the trumpet_id that is being replied to
under the foreign key reply_trumpet_id.

**Retrumpets** are "copies" of Trumpets that can be resubmitted into the system by users. As such, retrumpets share all data values
(likes, replies, etc) with the copied trumpet, and only consist of a unique retrumpet_id and the id of the "retrumpeter", user_id.


