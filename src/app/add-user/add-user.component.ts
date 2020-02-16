import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DataService } from '../data.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.less']
})
export class AddUserComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];

  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder) { }
  usersForm: FormGroup;
  matcher = new MyErrorStateMatcher();

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
    this.initUserForm();
  }
  private initUserForm() {
    this.usersForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      prefix: [null, Validators.required],
      title: [null, Validators.required],
      jobDescriptor: [null],
      phoneNumber: [null, Validators.required],
      email: [null, Validators.required],
      imageUrl: [null],
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.dataService.addUser(this.usersForm.value)
      .subscribe((res: any) => {
        const id = res.id;
        this.isLoadingResults = false;
        this.router.navigate(['/details', id]);
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

}
