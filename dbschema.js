let db = {
    screams: [
        {
            userHandle: 'user',
            body: 'This is a new body',
            createdAt: '2020-06-02T13:38:56.552Z',
            imageUrl: 'image/fndisfinfoafa',
            bio: 'Hello, my name is user, nice to meet you',
            website: 'https:user.com',
            location: 'London, UK'     
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'THis is a sample scream',
            createdAt: '2020-06-02T13:38:56.552Z',
            likeCount: 5,
            commentCount: 3
        }
    ],
    comments: [
        {
            userHandle: 'user3',
            screamId: 'nymEgGvYRXvokl8OMLo4',
            body: 'nice one mate',
            createdAt: '2020-06-02T13:38:56.552Z'
        }
    ],
};

const userDetails = {
    //Redux data 
    credentials: {
        userId: 'N43KJ5H43JREW4J5H3JWMERHB',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2020-06-02T13:38:56.552Z',
        imageUrl: 'image/fbdsikfste',
        bio: 'Hello I am user nice to meet you',
        website: 'https://user.com',
        location: 'Mumbai, India'
    },
    like: [
        {
            userHandle: 'user',
            screamId: '0vaTxIJZQ6ocJ4UrENIc'
        },
        {
            userHandle: 'user',
            screamId: 'Dgd3EBLFruDOjH42F24w'
        }
    ]
}