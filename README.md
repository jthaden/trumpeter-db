# trumpeter-db
This repo contains all code related to the backend of the Android application Trumpeter. This includes the MongoDB database, Node.js API
and backend, server code, relational data model, and more.

Built by jessethd with Node.js, Express, and Mongoose.



## Relational Data Model:
Relationally, the database is built around three entities: Users, Trumpets, and ReTrumpets. Trumpet entities can also be split into two
separate categories: Trumpets and ReplyTrumpets. The diagram below contains additional details regarding types and relations.

<a href="url"><img src="http://i.imgur.com/eKtoAY0.png"></a>

**User entities** in the system possess 5 attributes; 4 required, 1 optional: 
* user_id (PK)
* email_addr
* username 
* password
* profile_picture (nullable)


**Trumpet entities** have 8 attributes: 7 required, 1 optional:
* trumpet_id (PK)
* user_id (FK)
* reply_trumpet_id (FK) (nullable)
* submit_time
* text
* likes
* retrumpets
* replies

**Retrumpet entities** have only 3 attributes, all required:
* retrumpet_id (PK)
* trumpet_id (FK)
* user_id (FK)

**Users** currently contain only basic account management information.

**Trumpets** contain a foreign key reference to the posting user under user_id. Additionally, if the Trumpet is a reply Trumpet (that
is, it was submitted as a reply to another Trumpet), it will contain a foreign key reference to the trumpet_id that is being replied to
under the foreign key reply_trumpet_id.

**Retrumpets** are "copies" of Trumpets that can be resubmitted into the system by users. As such, retrumpets share all data values
(likes, replies, etc) with the copied trumpet, and only consist of a unique retrumpet_id and the id of the "retrumpeter", user_id.


## MongoDB Translation

Trumpeter utilizes relatively simple logic to retrieve, create, and update data, allowing for an intuitive and lightweight translation
to non-relational database technology. Additional details regarding data model (types, default values, etc) can be found within Mongoose files for each collection in the ```models``` directory.

**User collections** contain sensitive data utilized for account management functions. User documents are of varying schemas depending 
on information provided by the user. One per user.

**UserInfo collections** contain user information necessary for public display on Trumpets. Referenced within trumpet and retrumpet 
documents for data consistency and efficiency purposes.  One per user.

```
user_info (
     _id: ObjectId(x),
     email_addr: 'dumbo@gmail.com',
     username: 'BigEars',
     profile_picture: elephant_photo.jpg
)
```

**Trumpet collections** are generally represented in this format:

```
trumpet (
     _id: ObjectId(x),
     user_info_id: ObjectId(y),
     reply_trumpet_id: null OR ObjectId(r), 
     submit_time: 2/23/2015 11:55:36,
     text: 'I am the coolest elephant',
     likes: 5,
     retrumpets: 2,
     replies: 20
)
```
User information documents are referenced within each trumpet document, containing only necessary info about the author of the trumpet. 
If the trumpet is a reply trumpet (was submitted as a reply to another trumpet), the reply_trumpet_id field serves as a reference to the
trumpet document that is being replied to. Otherwise, this field is null. Only trumpets that are not replies are queried in the main
feed.

**Retrumpet collections** are generally represented in this format:

```
retrumpet (
      _id: ObjectId(x),
      trumpet: ObjectId(y),
      retrumpeter_username: 'Mr. Elephant'
)
```

A reference to the trumpet document that is being retrumpeted (copied) is contained within retrumpet documents, ensuring consistently up
to date trumpet data and efficient updating.  Retrumpets of both regular trumpets and reply trumpets are queried in the main feed. A 
retrumpet document contains only two additional fields, the unique id and the username of the user that created the retrumpet.


