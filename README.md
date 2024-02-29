Friends: 
  - Add friend:
    +  url: ```friends/request/:userId```
    +  method: POST
    +  request:
```
  headers: {
  Authorization: Bearer {token}
  }
```

  - Cancel friend request:
    +  url: ```friends/cancel/:userId```
    +  method: POST
    +  request:
```
  headers: {
  Authorization: Bearer {token}
  }
```

  - Accept friend request:
    +  url: ```friends/accept/:userId```
    +  method: POST
    +  request:
```
  headers: {
  Authorization: Bearer {token}
  }
```

  - Reject friend request:
    +  url: ```friends/reject/:userId```
    +  method: POST
    +  request:
```
  headers: {
  Authorization: Bearer {token}
  }
```

  - Current user friends:
    +  url: ```friends```
    +  method: GET
    +  request:
```
  headers: {
  Authorization: Bearer {token}
  }
```
