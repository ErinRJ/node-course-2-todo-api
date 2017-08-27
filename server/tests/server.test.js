const expect= require('expect');
const request= require('supertest');

const {ObjectID}= require('mongodb');
// write ../ to go back a directory
const {app}= require('./../server');
const {Todo}= require('./../models/todo');

const todos= [{
  _id: new ObjectID(),
  text: 'First test todo'},
  { _id: new ObjectID(),
    text: 'Second test todo'
}];

//test the todos collection to see if there's any todos in there before we start the code
//runs before each test case
//only proceeds to the test case once done() is called
beforeEach((done) => {
  //remove all todos
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
});


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
