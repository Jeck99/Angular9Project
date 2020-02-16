import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent implements OnInit {
  user: User = { id: 0, firstName: '', lastName: '', prefix: '', title: '', jobDescriptor: '', phoneNumber: '', email: '', imageUrl: '' };
  isLoadingResults = true;
  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router) { }

  getUserDetails(id: string) {
    this.dataService.getUserById(id)
      .subscribe((data: any) => {
        this.user = data;
        console.log(this.user);
        this.isLoadingResults = false;
      });
  }
  deleteUser(id: any) {
    this.isLoadingResults = true;
    this.dataService.deleteUser(id)
      .subscribe(res => {
        this.isLoadingResults = false;
        this.router.navigate(['/users']);
      }, (err) => {
        console.log(err);
        this.isLoadingResults = false;
      }
      );
  }
  ngOnInit(): void {
    this.getUserDetails(this.route.snapshot.params.id);
  }
}
