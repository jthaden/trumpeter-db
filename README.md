# trumpeter-db
This repo contains all code related to the backend of the Android application Trumpeter. This includes the MongoDB database, Node.js API
and backend, relational data model, and more.
Built by jessethd.


## Relational Data Model:
Relationally, the database is built around three entities: Users, Trumpets, and ReTrumpets. Trumpet entities can also be split into two
separate categories: Trumpets and ReplyTrumpets. The diagram below contains additional details regarding types and relations.
<a href="url"><img src="http://i.imgur.com/AIdFRim.png"></a>

**User entities** in the system possess 5 attributes; 4 required, 1 optional: 
* user_id (PK)
* email_addr
* username 
* password
* profile_picture (nullable)


**Trumpet entities** have 7 attributes: 6 required, 1 optional:
* trumpet_id (PK)
* user_id (FK)
* reply_trumpet_id (FK) (nullable)
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
