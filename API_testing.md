# API testing with Bruno

## POST Route

### Request

```
POST http://localhost:3000/tasks
```

### Body

```
{
  "title": "dire coucou",
"isCompleted": false
}
```

### Response 

```
{
  "id": 1,
  "title": "dire coucou",
  "isCompleted": false
}
```

## GET Route

### Request

```
GET http://localhost:3000/tasks
```

### Body

```
none
```

### Response 

```
{
  "message": "3 tasks found",
  "tasks": [
    {
      "id": 1,
      "title": "Dire coucou a Lenny",
      "isCompleted": true
    },
    {
      "id": 2,
      "title": "dire coucou",
      "isCompleted": false
    },
    {
      "id": 3,
      "title": "dire coucou",
      "isCompleted": false
    }
  ]
}
```

### Request

```
GET http://localhost:3000/tasks?status=uncompleted
```

### Body

```
none
```

### Response 

```
{
  "message": "2 uncompleted tasks found",
  "filteredTasks": [
    {
      "id": 2,
      "title": "dire coucou",
      "isCompleted": false
    },
    {
      "id": 3,
      "title": "dire coucou",
      "isCompleted": false
    }
  ]
}
```

### Request

```
GET http://localhost:3000/tasks?status=completed
```

### Body

```
none
```

### Response 

```
{
  "message": "1 completed tasks found",
  "filteredTasks": [
    {
      "id": 1,
      "title": "Dire coucou a Lenny",
      "isCompleted": true
    }
  ]
}
```


## PUT Route

### Request

```
PUT http://localhost:3000/tasks/1
```

### Body

```
{
  "title": "Dire coucou a Lenny",
  "isCompleted": true
}
```

### Response 

```
{
  "id": 1,
  "title": "Dire coucou a Lenny",
  "isCompleted": true
}
```

## DELETE Route

### Request

```
DELETE http://localhost:3000/tasks/2
```

### Body

```
none
```

### Response 

```
{
  "message": "task deleted",
  "task": {
    "id": 2,
    "title": "dire coucou",
    "isCompleted": false
  }
}
```
