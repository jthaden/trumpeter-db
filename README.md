# trumpeter-db
This repo contains all code related to the backend of the Android application Trumpeter. This includes the MongoDB database, Node.js API
and backend, relational data model, and more.
Built by jessethd.


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

**ReTrumpet entities** have only 3 attributes, all required:
* retrumpet_id (PK)
* trumpet_id (FK)
* user_id (FK)

**Users** currently contain only basic account management information.

**Trumpets** contain a foreign key reference to the posting user under user_id. Additionally, if the Trumpet is a reply Trumpet (that
is, it was submitted as a reply to another Trumpet), it will contain a foreign key reference to the trumpet_id that is being replied to
under the foreign key reply_trumpet_id.

**ReTrumpets** are "copies" of Trumpets that can be resubmitted into the system by users. As such, retrumpets share all data values
(likes, replies, etc) with the copied trumpet, and only consist of a unique retrumpet_id and the id of the "retrumpeter", user_id.


## MongoDB Translation

Trumpeter utilizes relatively simple logic to retrieve, create, and update data, allowing for an intuitive and lightweight translation
to non-relational database technology. 

**User collections** contain sensitive data, and all account authorizations in the system are managed securely using
OAuth2.0. User documents are of varying schemas depending on information provided by the user.

**Trumpet collections** are generally represented in this format:

```
trumpet (
     _id: ObjectId(x),
     user_info:
     user_info (
          email_addr: 'dumbo@gmail.com',
          username: 'BigEars',
          profile_picture: elephant_photo.jpg
     ),
     reply_trumpet_id: null; 
     submit_time: someRepresentationOfTime,
     text: 'I am the coolest elephant',
     likes: 5,
     retrumpets: 2,
     replies: 20,
)
```
User information documents are embedded within each trumpet document, containing only necessary info about the author of the trumpet. If
the trumpet is a reply trumpet (was submitted as a reply to another trumpet), the reply_trumpet_id field serves as a reference to the
trumpet document that is being replied to. Otherwise, this field is null. Only trumpets that are not replies are queried in the main
feed.

**Retrumpet collections** are generally represented in this format:

```
retrumpet (
      _id: new MongoId("y"),
      trumpet:
      trumpet (
           _id: new MongoId("x"),
           user_info:
           user_info (
               email_addr: 'dumbo@gmail.com',
               username: 'BigEars',
               profile_picture: elephant_photo.jpg
           ),
           reply_trumpet_id: ObjectId(z) OR null, 
           submit_time: someRepresentationOfTime,
           text: 'I am the coolest elephant',
           likes: 5,
           retrumpets: 2,
           replies: 20,
       ),
       retrumpeter_username: 'Mr. Elephant', 
)
```

The trumpet that is being retrumpeted is embedded within retrumpet documents. Retrumpets of both regular trumpets and reply trumpets
are queried in the main feed. The retrumpet document contains only two additional fields, the unique id and the username of the user
that created the retrumpet.


