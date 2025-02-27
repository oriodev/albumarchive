# album archive.

the final year project for my liberal arts & natural sciences degree from the university of birmingham.

album archive is goodreads or letterboxd for your music! record albums you've listened to, organise them into lists, share those lists with your friends, send and receive album recommendations, and join group chats to meet fans of your favourite music!

built with turborepo, next.js/react, tailwind, shadcn, nest.js/node, mongoose, and mongodb. also uses socket.io for websockets. 

## features.

**albums/discogs.**

![image](https://github.com/user-attachments/assets/66bef4c9-4668-4d6f-a4b0-dac450c49b21)

albums are initially retrieved from the discogs api and then stored in the local mongo database for faster retrieval, flexibility, and reliability.

![image](https://github.com/user-attachments/assets/181ac829-18e5-41b1-a69d-4c4dd6e7becb)

album pages display all the key information about an album, including the overall rating given by all users of the site, other albums by that artist, and reviews.

**authentication.**

pretty bogstandard.

**images.**

![image](https://github.com/user-attachments/assets/72ed225d-4212-40c1-be05-a67705f426f7)

users can upload custom images for profile pictures and list covers, powered by cloudinary.

**lists.**

![image](https://github.com/user-attachments/assets/9beb41ac-de0c-41c8-8ba3-fd7b06be36de)

![image](https://github.com/user-attachments/assets/2f58e1a7-86ed-48d0-96d8-c510b73d595c)


users have default 'listened' and 'to listen' lists where they can store all the lists they have listened to or want to listen to. they can also make custom lists, with any name, description, and custom cover image that they like, and add lists to those. these custom lists can be searched for and shared among users.

**likes.**

you can like a list. we do cool stuff with that info, like showing users the currently trending lists.

**rooms/messages.**

![image](https://github.com/user-attachments/assets/635c420a-d4a7-420d-afac-c764e53232e5)

my pride and joy. we have chatrooms! users can chat live with one another via the power of websockets.


![image](https://github.com/user-attachments/assets/4cc05095-62d9-4fee-82b7-ab943c14b8a1)

they can also send each other lists and albums, which sends a nicely formatted link for the other users to enjoy. users can only send albums they have listened to and they can send any of their lists PLUS any lists they have liked.

**notifications.**

yup, notifications work too. useful for friend requests.

![image](https://github.com/user-attachments/assets/a00cfc1d-27fd-4123-9138-2fb04b9bd52f)

also useful for album recs, another one of my pride and joys. users can go to an album page and send an album recommendation to any user they follow. then the user gets a notification saying their friend has recommended them this album, and they can decline it or add it to their to listen list. very nice.

**reviews.**

![image](https://github.com/user-attachments/assets/de7202d8-35df-4d2a-9cfd-710b8f0508b3)

users can write, edit, delete, and view all reviews left on an album by other users.

![image](https://github.com/user-attachments/assets/32cfce18-9d7a-4b64-b08e-10f91bce87a4)

reviews consist of a star rating (no half stars yet much to my dismay), a 'vibe' picker (just for fun), and a message box.
