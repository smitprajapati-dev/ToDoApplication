/* eslint-disable react/state-in-constructor */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import React, { Component, createRef } from 'react';

export default class Home extends Component {
  state = {
    todoList: [],
    filterType: 'all',
  };

  inputRef = createRef();

  // changeText = event => {
  //   this.setState({ todoText: event.target.value });
  // };

  addToDo = event => {
    event.preventDefault();
    const inputText = this.inputRef.current;
    console.log('hello');
    this.setState(
      ({ todoList }) => ({
        todoList: [
          ...todoList,
          { id: new Date().valueOf(), text: inputText.value, isDone: false },
        ],
      }),
      () => {
        inputText.value = '';
      },
    );
  };

  toggleComplete = item => {
    this.setState(({ todoList }, props) => {
      const index = todoList.findIndex(x => x.id === item.id);
      return {
        todoList: [
          ...todoList.slice(0, index),
          { ...item, isDone: true },
          ...todoList.slice(index + 1),
        ],
      };
    });
  };

  toDelete = item => {
    this.setState(({ todoList }, props) => {
      const index = todoList.findIndex(x => x.id === item.id);
      return {
        todoList: [...todoList.slice(0, index), ...todoList.slice(index + 1)],
      };
    });
  };

  changeFilterType = filterType => {
    this.setState({ filterType });
  };

  render() {
    const { todoList, filterType } = this.state;
    return (
      <div className=" flex flex-col items-center h-screen">
        <h1 className="text-xl font-extrabold">To App</h1>
        <form
          onSubmit={this.addToDo}
          className="flex w-full max-w-sm items-center"
        >
          <Input
            className="rounded-r-none"
            ref={this.inputRef}
            // value={todoText}
            // onChange={this.changeText}
            required
          />
          <Button type="submit" className="rounded-l-none">
            Button
          </Button>
        </form>
        <div className="m-4 flex flex-col gap-6 w-full p-6 flex-1">
          {todoList
            .filter(x => {
              switch(filterType) {
                case 'pending':
                  return x.isDone === false;

                case 'completed':
                  return x.isDone === true;

                default:
                  return true;
              }
            })
            .map(item => (
              <div key={item.id} className="flex  items-center ">
                <Checkbox
                  chcked={item.isDone}
                  onCheckedChange={() => this.toggleComplete(item)}
                />
                <p className="flex-1 px-4 ">{item.text}</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => this.toDelete(item)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/* <Button type="button" onClick={() => this.toDelete(item)}>
                Button
              </Button> */}
              </div>
            ))}
        </div>
        <div className="w-full flex">
          <Button
            className="flex-1 rounded-none"
            variant={filterType === 'all' ? 'destructive' : 'default'}
            onClick={() => this.changeFilterType('all')}
          >
            All
          </Button>
          <Button
            className="flex-1 rounded-none"
            variant={filterType === 'pending' ? 'destructive' : 'default'}
            onClick={() => this.changeFilterType('pending')}
          >
            Pending
          </Button>
          <Button
            className="flex-1 rounded-none"
            variant={filterType === 'completed' ? 'destructive' : 'default'}
            onClick={() => this.changeFilterType('completed')}
          >
            Completed
          </Button>
        </div>
      </div>
    );
  }
}
