const expect= require('expect');
const request= require('supertest');

const {ObjectID}= require('mongodb');
// write ../ to go back a directory
const {app}= require('./../server');
const {Todo}= require('./../models/todo');
const {User}= require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text= 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

//what about if we submit invalid data
  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      //handle any errors:
      .end((err, res) => {
        if(err) {
          return done(err);
        }
      //if there are no errors, fetch all todos of the collection
      Todo.find().then((todos) => {
        //let's make sure that there are no todos
        expect(todos.length).toBe(2);
        //exeunt
        done();
      }).catch((e) => done(e));
    });
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});


describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  var hexId= new ObjectID().toHexString();

  it('should return 404 if the todo not found', (done) => {
    //make sure you get a 404 back
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
    });
  });

  describe('DELETE/todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
          .delete(`/todos/${hexId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
          })
          .end((err) => {
            if (err) {
              return done(err);
            }

                        //find the todo with that id
                        //test whether it exists
                        //add a catch clause to catch errors
          Todo.findById(hexId).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((e) => done(e));
          });


          });
    });

    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toHexString();
      //make sure you get a 404 back
      request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
      request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
    });

    describe('PATCH /todos/:id', () => {
      it('should update the todo', (done) => {
        //grab id of first item
        var hexId = todos[0]._id.toHexString();
        var text = "YOLO";
        //make patch request
        request(app)
          .patch(`/todos/${hexId}`)
          .send({
            completed: true,
            text
          })
        //assert you get 200
          .expect(200)
        //assert the text is changed, completed is true, completedAt is a number .toBeA
          .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
          })
          .end(done);
      });

      it('should clear completedAt when todo is not completed', (done) => {
        //grab id of first item
        var hexId = todos[1]._id.toHexString();
        var text= "this is the second text!"
        //make patch request
        request(app)
          .patch(`/todos/${hexId}`)
          .send({
            completed: false,
            text
          })
        //assert you get 200
          .expect(200)
        //assert the text is changed, completed is true, completedAt is a number .toBeA
          .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
          })
          .end(done);
        });
      });


describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
    });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email='example@eda.com';
    var password='123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }
        //find the user where the email was used
        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        })
      });
  });

  it('should return validation errors if request invalid', (done) => {
    //send an invalid email and password
    request(app)
    .post('/users')
    .send({email: 'hon', password: 'no'})
    .expect(400)
    //expect 400- if it does give you this--> SUCCESS
    .end(done);
  });

  it('should not create user if that email is already in use', (done) => {
    //send an email already taken
    var password= 'password';

    request(app)
      .post('/users')
      .send({
        email: 'IamSoTired@wannaGoHome.com',
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});
