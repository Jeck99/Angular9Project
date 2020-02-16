import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../user';
import { DataService } from '../data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit , OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  users:User[] = [];
  displayedColumns: string[] = ['prefix', 'firstName', 'lastName', 'title', 'jobDescriptor'];
  isLoadingResults = true;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getUsers()
    .subscribe((res: any) => {
      this.users = res;
      console.log(this.users);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }  
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
