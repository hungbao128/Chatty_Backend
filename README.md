Friends: 
  - Add friend:
    +  url: friends/request/:userId
    +  method: POST
    +  request:
```
  headers: {
  Authorization: Bearer {token}
  }
```

  - Cancel friend request:
    +  url: friends/cancel/:userId
    +  method: POST
    +  request:
```
  headers: {
  Authorization: Bearer {token}
  }
```
