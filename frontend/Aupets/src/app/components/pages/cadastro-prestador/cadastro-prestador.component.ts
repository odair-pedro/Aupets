import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PrestadorForCreation } from 'src/app/interfaces/prestadorForCreation.mode';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { PrestadorRepositoryService } from 'src/app/shared/services/prestador-repository.service';


@Component({
  selector: 'app-cadastro-prestador',
  templateUrl: './cadastro-prestador.component.html',
  styleUrls: ['./cadastro-prestador.component.css'],
})
export class CadastroPrestadorComponent {
  companyRegisterForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private prestadorService: PrestadorRepositoryService,
    private router: Router,
    private messagesService: MessagesService

  ) { }

  ngOnInit() {
    this.companyRegisterForm = this.fb.group({
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      tipoPessoa: ['', Validators.required],
      cnpjCpf: ['', Validators.compose([Validators.required, Validators.maxLength(18)]),
      ],
      endereco: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      cep: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(8)]),
      ],
      numero: ['', Validators.required],
      atuacao: ['', Validators.required],
      especializacao: ['', Validators.required],
      urlSite: [''],

      imagem: ['', Validators.required],
      usuarioId: [localStorage.getItem('userId')],
      statusId: [1],
      terms: ['', Validators.required],
    });

  }

  //Todo: Funções que checam os campos e se estão validos

  checkReason() {
    return (
      this.companyRegisterForm.controls['razaoSocial'].dirty &&
      this.companyRegisterForm.hasError('required', 'razaoSocial')
    );
  }

  checkFantasyName() {
    return (
      this.companyRegisterForm.controls['nomeFantasia'].dirty &&
      this.companyRegisterForm.hasError('required', 'nomeFantasia')
    );
  }

  checkTypePerson() {
    return (
      this.companyRegisterForm.controls['tipoPessoa'].dirty &&
      this.companyRegisterForm.hasError('required', 'tipoPessoa')
    );
  }

  checkCpfCnpj() {
    return (
      this.companyRegisterForm.controls['cnpjCpf'].dirty &&
      this.companyRegisterForm.hasError('required', 'cnpjCpf')
    );
  }

  checkCpfCnpjValid() {
    return (
      this.companyRegisterForm.controls['cnpjCpf'].dirty &&
      this.companyRegisterForm.hasError('maxlength', 'cnpjCpf')
    );
  }

  checkAddress() {
    return (
      this.companyRegisterForm.controls['endereco'].dirty &&
      this.companyRegisterForm.hasError('required', 'endereco')
    );
  }

  checkNeighborhood() {
    return (
      this.companyRegisterForm.controls['bairro'].dirty &&
      this.companyRegisterForm.hasError('required', 'bairro')
    );
  }

  checkCity() {
    return (
      this.companyRegisterForm.controls['cidade'].dirty &&
      this.companyRegisterForm.hasError('required', 'cidade')
    );
  }

  checkCep() {
    return (
      this.companyRegisterForm.controls['cep'].dirty &&
      this.companyRegisterForm.hasError('required', 'cep')
    );
  }
  checkCepValid() {
    return (
      this.companyRegisterForm.controls['cep'].dirty &&
      this.companyRegisterForm.hasError('maxlength', 'cep')
    );
  }

  checkNumber() {
    return (
      this.companyRegisterForm.controls['numero'].dirty &&
      this.companyRegisterForm.hasError('required', 'numero')
    );
  }

  checkOccupation() {
    return (
      this.companyRegisterForm.controls['atuacao'].dirty &&
      this.companyRegisterForm.hasError('required', 'atuacao')
    );
  }

  checkSpecialization() { }

  checkImage() {
    return (
      this.companyRegisterForm.controls['imagem'].dirty &&
      this.companyRegisterForm.hasError('required', 'imagem')
    );
  }

  checkTerm() {
    return (
      this.companyRegisterForm.controls['terms'].dirty &&
      this.companyRegisterForm.hasError('required', 'terms')
    );
  }

  onSubmit() {
    if (this.companyRegisterForm.valid) {
      //ENVIAR DADOS PARA A API
      if (this.authService.isLogged()) {
        const form = this.companyRegisterForm.value;
        this.criarPrestador(form);
      } else {
        this.messagesService.add('Realize login primeiro!')
        this.router.navigate(['/login']);
      }
    } else {
      //Disparo do erro
      this.validateAllFormFields(this.companyRegisterForm);
    }
  }

  criarPrestador(prestador: PrestadorForCreation) { 

    const formData = new FormData();
    
    formData.append('NomeFantasia', prestador.nomeFantasia);
    formData.append('RazaoSocial', prestador.razaoSocial);
    formData.append('TipoPessoa', prestador.tipoPessoa);
    formData.append('CnpjCpf', prestador.cnpjCpf);
    formData.append('Endereco', prestador.endereco);
    formData.append('Complemento', prestador.complemento);
    formData.append('Bairro', prestador.bairro);
    formData.append('Cidade', prestador.cidade);
    formData.append('Cep', prestador.cep);
    formData.append('Numero', prestador.numero);
    formData.append('Atuacao', prestador.atuacao);
    formData.append('Especializacao', prestador.especializacao);
    formData.append('Imagem', prestador.imagem);
    formData.append('UrlSite', prestador.urlSite);
    formData.append('Sobre', prestador.sobre);

    const apiUrl = 'api/prestador'
    this.prestadorService.createPrestador(apiUrl, formData ).subscribe({
      next: () => {
        this.companyRegisterForm.reset();
        this.messagesService.add('Cadastro realizado com sucesso!');
      },
      error: (err) => {
        this.messagesService.add(err.error);
      }
    });
  }

  //Percorre o formulario e valida os inputs caso estejam vazios
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  
}
