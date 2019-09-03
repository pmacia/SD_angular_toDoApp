import { Component, OnInit } from '@angular/core';

import { TaskService } from '../../services/task.service';
import { Task } from '../../Task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // Propiedades accesibles desde el código HTML asociado (en tasks.component.html)
  tasks: Task[];            // Lista con todas las tareas actuales
  titulo: string;           // Descripción para una nueva tarea

  // Constructor: recupera del servicio API Rest las tareas actuales
  constructor(private taskService: TaskService) {
    this.taskService.getTasks()
      .subscribe(tasks => {
        console.log(tasks);
        this.tasks = tasks;
      });
  }

  ngOnInit() {
  }

  // Método para añadir una tarea nueva
  addTask(event) {
    event.preventDefault(); // No queremos que se refresque la pantalla
    const newTask: Task = {
      title: this.titulo,
      isDone: false
    };
    this.taskService.addTask(newTask)
      .subscribe(task => {
        this.tasks.push(task);
        this.titulo = '';
      });
  }

  // Método para eliminar una tarea existente
  deleteTask(id: any) {
    const response = confirm('¿Estás seguro de que deseas eliminar la tarea?');

    if (response) {
      const tasks = this.tasks;
      this.taskService.deleteTask(id)
        .subscribe(data => {
          console.log(data.n);
          if (data.n === 1) {
            for (let i = 0; i < tasks.length; i++) {
              if (tasks[i]._id === id) {
                tasks.splice(i, 1);
              }
            }
          }
        });
    }
  }

  // Método para actualizar el estado de una tarea (realizada o pendiente)
  updateStatus(task: Task) {
    const newTask = {
      title: task.title,
      isDone: !task.isDone
    };
    this.taskService.updateTask(task._id, newTask)
      .subscribe(res => {
        task.isDone = !task.isDone;
      });
  }

}
