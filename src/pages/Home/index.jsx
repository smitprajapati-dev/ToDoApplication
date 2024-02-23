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

  async componentDidMount() {
    this.loadToDo();
  }

  loadToDo = async () => {
    try {
      const res = await fetch('http://localhost:3000/todoList');
      const json = await res.json();
      this.setState({ todoList: json });
    } catch (error) {}
  };

  addToDo = async event => {
    try {
      event.preventDefault();
      const inputText = this.inputRef.current;
      const res = await fetch('http://localhost:3000/todoList', {
        method: 'POST',
        body: JSON.stringify({
          text: inputText.value,
          isDone: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const json = await res.json();

      this.setState(
        ({ todoList }) => ({
          todoList: [...todoList, json],
        }),
        () => {
          inputText.value = '';
        },
      );
    } catch (error) {}
  };

  toggleComplete = async item => {
    try {
      const res = await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...item,
          isDOne: !item.isDOne,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const json = await res.json();

      this.setState(({ todoList }) => {
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [
            ...todoList.slice(0, index),
            json,
            ...todoList.slice(index + 1),
          ],
        };
      });
    } catch (error) {}
  };

  toDelete = async item => {
    try {
      await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'DELETE',
      });

      this.setState(({ todoList }) => {
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [...todoList.slice(0, index), ...todoList.slice(index + 1)],
        };
      });
    } catch (error) {}
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
          <Input className="rounded-r-none" ref={this.inputRef} required />
          <Button type="submit" className="rounded-l-none">
            Button
          </Button>
        </form>
        <div className="m-4 flex flex-col gap-6 w-full p-6 flex-1">
          {todoList
            .filter(x => {
              switch (filterType) {
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
                  checked={item.isDone}
                  onCheckedChange={() => this.toggleComplete(item)}
                />
                <p
                  className={`flex-1 px-4 ${item.isDone ? 'line-through' : ''}`}
                >
                  {item.text}
                </p>
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
