## Friends: 
  - Add friend:
    +  url: ```api/v1/friends/request/:userId```
    +  method: POST
    +  request:
```
  headers: {
    Authorization: Bearer {token}
  }
```

  - Cancel friend request:
    +  url: ```api/v1/friends/cancel/:userId```
    +  method: POST
    +  request:
```
  headers: {
    Authorization: Bearer {token}
  }
```

  - Accept friend request:
    +  url: ```api/v1/friends/accept/:userId```
    +  method: POST
    +  request:
```
  headers: {
    Authorization: Bearer {token}
  }
```

  - Reject friend request:
    +  url: ```api/v1/friends/reject/:userId```
    +  method: POST
    +  request:
```
  headers: {
    Authorization: Bearer {token}
  }
```

  - Current user friends:
    +  url: ```api/v1/friends```
    +  method: GET
    +  request:
```
  headers: {
    Authorization: Bearer {token}
  }
```
