const expect= require('expect');
const request= require('supertest');

// write ../ to go back a directory
const {app}= require('./../server');
const {Todo}= require('./../models/todo');

//test the todos collection to see if there's any todos in there before we start the code
//runs before each test case
//only proceeds to the test case once done() is called
beforeEach((done) => {
  //remove all todos
  Todo.remove({}).then(() => done());
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

        Todo.find().then((todos) => {
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
        expect(todos.length).toBe(0);
        //exeunt
        done();
      }).catch((e) => done(e));
    });
  });
});
