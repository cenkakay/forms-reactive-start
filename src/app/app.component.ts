import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  genders = ["male", "female"];
  signUpForm: FormGroup;
  forbiddenUsernames = ["Chris", "Anna"];

  ngOnInit() {
    this.signUpForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          this.forbiddenNames.bind(this),
        ]),
        email: new FormControl(
          null,
          [Validators.required, Validators.email],
          this.forbiddenEmails.bind(this)
        ),
      }),

      gender: new FormControl(this.genders[0]),
      hobbies: new FormArray([]),
    });
    /*  this.signUpForm.valueChanges.subscribe((value) => {
      console.log(value);
    }); */
    this.signUpForm.statusChanges.subscribe((value) => {
      console.log(value);
    });
    this.signUpForm.setValue({
      userData: {
        username: "Max",
        email: "max@text.com",
      },
      gender: "male",
      hobbies: [],
    });
    // only changes part of it. Patch value !
    this.signUpForm.patchValue({
      userData: {
        username: "Anna",
      },
    });
  }
  onSubmit() {
    console.log(this.signUpForm);
    this.signUpForm.reset();
  }
  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signUpForm.get("hobbies")).push(control);
  }

  get controls() {
    return (this.signUpForm.get("hobbies") as FormArray).controls;
  }
  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {
        nameIsForbidden: true,
      };
    }
    return null;
  }
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === "test@test.com") {
          resolve({
            emailForbidden: true,
          });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}
