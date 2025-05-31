import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Users } from '../../services/users.service';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

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
export class Login implements AfterViewInit {
  role: UserRole = 'Admin';
  slideDirection: SlideDirection = 'right';
  registerModalInstance?: Modal;
  private destroy$ = new Subject<void>();

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
  registerForm: FormGroup

  @ViewChild('passwordInput', { static: true }) passwordInput!: ElementRef;
  @ViewChild('usernameInput', { static: true }) usernameInput!: ElementRef;

  constructor(private usersService: Users, private fb: FormBuilder, private router: Router) {
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

  ngOnInit(): void {
    // Configuramos el debounce para la búsqueda del username
    this.loginForm.get('username')?.valueChanges
      .pipe(
        debounceTime(500), // Espera 500ms después de la última tecla
        distinctUntilChanged(), // Solo si el valor cambió
        takeUntil(this.destroy$) // Limpieza al destruir el componente
      )
      .subscribe(username => {
        if (username && username.length > 2) { // Solo buscar si tiene al menos 3 caracteres
          this.searchUsername(username);
        }
      });
  }

  ngAfterViewInit(): void {
    // Focus inicial con timeout para evitar ExpressionChangedAfterItHasBeenCheckedError
    this.focusUsernameInput();
  }

  focusUsernameInput(): void {
    setTimeout(() => {
      this.usernameInput.nativeElement.focus();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchUsername(username: string): void {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        const user = users.find((u: any) => u.username === username);
        if (user) {
          setTimeout(() => {
            this.passwordInput.nativeElement.focus();
          }, 0);
        }
      },
      error: (error) => {
        console.error('Error searching user:', error);
      }
    });
  }

  changeRole(newRole: UserRole): void {
    if (this.role !== newRole) {
      this.slideDirection = this.role === 'Employee' ? 'left' : 'right';
      this.role = newRole;
      this.focusUsernameInput();
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
        });

        // Navegación después de cerrar el alert
        setTimeout(() => {
          console.log(response)
          if (this.role.toLowerCase() === 'employee') {
            this.router.navigate([`/home/employee/${response.user.username}`]);
          } else if (this.role.toLowerCase() === 'admin') {
            this.router.navigate([`/home/admin/${response.user.username}`]);
          }
        }, 1000);
      },
      error: (error) => {
        console.error('Login error:', error);
        Swal.fire({
          title: 'Login Failed',
          text: error.error?.message || 'Invalid credentials',
          icon: 'error',
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