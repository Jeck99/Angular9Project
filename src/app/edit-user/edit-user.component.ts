import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { MyErrorStateMatcher } from '../add-user/add-user.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.less']
})
export class EditUserComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder) { }

  usersForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  id=0;
  firstName = '';
  lastName = '';
  prefixOptions = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Miss.',];
  title = '';
  jobDescriptor = '';
  phoneNumber = '';
  email = '';
  imageUrl = '';

  isLoadingResults = false;

  ngOnInit(): void {
    this.popUserFields();
  }
  private popUserFields() {
    this.getUserById(this.route.snapshot.params.id);
    this.usersForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      prefix: [null, Validators.required],
      title: [null, Validators.required],
      jobDescriptor: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      email: [null, Validators.required],
      imageUrl: [null, Validators.required]
    });
  }

  getUserById(id: any) {
    this.dataService.getUserById(id).subscribe((data: any) => {
      this.id = data.id;
      this.usersForm.setValue({
        firstName: data.firstName,
        lastName: data.lastName,
        prefix: data.prefix,
        title: data.title,
        jobDescriptor: data.jobDescriptor,
        phoneNumber: data.phoneNumber,
        email: data.email,
        imageUrl: data.imageUrl
      });
    });
  }
  onFormEditSubmit() {
    this.isLoadingResults = true;
    this.dataService.updateUser(this.id, this.usersForm.value)
      .subscribe((res: any) => {
          const id = res._id;
          this.isLoadingResults = false;
          this.router.navigate(['/details', id]);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }
  showUserDetails() {
    this.router.navigate(['/details', this.id]);
  }
}
