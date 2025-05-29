import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Users } from '../../services/users.service';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2'
import { Modal } from 'bootstrap'

type UserRole = 'Employee' | 'Admin';
type SlideDirection = 'left' | 'right';

interface RoleConfig {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  role: UserRole = 'Admin';
  slideDirection: SlideDirection = 'right';
  registerModalInstance?: Modal;

  readonly roles: Record<UserRole, RoleConfig> = {
    Employee: {
      icon: 'https://img.icons8.com/ios-filled/50/FFFFFF/manager.png',
      label: 'Employee'
    },
    Admin: {
      icon: 'https://img.icons8.com/ios-filled/50/FFFFFF/admin-settings-male.png',
      label: 'Admin'
    }
  };

  readonly roleList: UserRole[] = ['Employee', 'Admin'];

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private usersService: Users, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
      role: [this.role]
    });
    this.registerForm = this.fb.group({
      username: [''],
      password: [''],
      role: [this.role]
    });
  }

  changeRole(newRole: UserRole): void {
    if (this.role !== newRole) {
      this.slideDirection = this.role === 'Employee' ? 'left' : 'right';
      this.role = newRole;
    }
  }

  getAnimationClass(): string {
    return `slide-in-${this.slideDirection}`;
  }

  isActive(role: UserRole): boolean {
    return this.role === role;
  }

  register(): void {
    this.usersService.registerUser(this.registerForm.value).subscribe({
      next: () => {
        Swal.fire({
          title: 'Registration Successful',
          text: 'You can now log in with your credentials.',
          icon: 'success',
          confirmButtonText: 'OK',
          position: 'top-end',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          this.registerForm.reset();
          const closeButton = document.querySelector('#registerModal .btn.btn-secondary') as HTMLElement;
          if (closeButton) {
            closeButton.setAttribute('data-bs-dismiss', 'modal');
            closeButton.click();
            closeButton.removeAttribute('data-bs-dismiss');
          }
        })
      },
      error: () => {
        Swal.fire({
          title: 'Registration Failed',
          text: 'Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
          position: 'top-end',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    })
  }

  login(): void {
    this.loginForm.setControl('role', this.fb.control(this.role));
    this.usersService.logInUser(this.loginForm.value).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Login Successful',
          text: `Welcome ${response.user.username}!`,
          icon: 'success',
          confirmButtonText: 'OK',
          position: 'top-end',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          // Redirect or perform any other action after successful login
        })
      },
      error: () => {
        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid username, password or role',
          icon: 'error',
          confirmButtonText: 'OK',
          position: 'top-end',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  }
}