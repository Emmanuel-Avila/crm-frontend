<script setup>
import OffCanvas from '../components/OffCanvas.vue';
import UserCanvas from '../components/UserCanvas.vue';
import Editor from '@tinymce/tinymce-vue';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { Form } from 'vee-validate'

import Swal from 'sweetalert2';
import router from "../router/index"

const photoLink = ref('');
const changedIndex = ref(-1);
const selectVal = ref("")

const accountDetails = ref({
  name: '',
  title: '',
  description: '',
})


const accounts = ref([{ image: '', window: '', app: '' }])
const secondAccounts = ref([{ image: '', soles: '', dollars: '', interSoles: '', interDollars: '' }])

const addaccounts = () => {
  accounts.value.push({ image: '', window: '', app: '' });
}

const removeService = (index) => {
  accounts.value.splice(index, 1)
}

const addSecond = () => {
  secondAccounts.value.push({ image: '', soles: '', dollars: '', interSoles: '', interDollars: '' })
}

const removeAccount = (index) => {
  secondAccounts.value.splice(index, 1)
}

const onPhotoLinkChange = (newLink, oldLink) => {

  const index = changedIndex.value;
  if (index !== -1 && selectVal.value === 'first') {
    accounts.value[index].image = newLink; // Asignar el nuevo valor en 'photoLinks'
    console.log(accounts.value[index].image);
  }

  if (index !== -1 && selectVal.value === 'second') {
    secondAccounts.value[index].image = newLink; // Asignar el nuevo valor en 'photoLinks'
  }
};


watch(photoLink, onPhotoLinkChange);

watch(selectVal, (newVal, oldVal) => {

  if (newVal) {
    axios.get(`${import.meta.env.VITE_SERVER}/accounts/${newVal}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(function (response) {
        const { data } = response;
        console.log(data);
        accountDetails.value.name = data.name;
        accountDetails.value.title = data.title;
        accountDetails.value.description = data.description;

        if (newVal == "first" && data.accounts.length !== 0) {
          accounts.value = data.accounts
        }

        if (newVal === "second" && data.accounts.length !== 0) {
          secondAccounts.value = data.accounts
        }

      })
      .catch(function (error) {
        if (error.response.status === 401 || error.response.status === 403) {
          Swal.fire({
            icon: 'error',
            text: "Por favor, inicie sesión"
          })
          localStorage.setItem("user", "");
          localStorage.setItem("token", "");
          router.push({ name: "login" });
        } else {
          Swal.fire({
            icon: 'error',
            text: "Hubo un error con la petición, por favor intentelo mas tarde"
          })
        }
        console.log(error.response.message);
      })
  }
})


const widget = window.cloudinary.createUploadWidget(
  { cloud_name: "djtaptkxe", upload_preset: "upload-demo" },
  (error, result) => {
    if (!error && result && result.event === 'success') {
      console.log(result.info);
      photoLink.value = result.info.secure_url
    }
  }
)
function openUploadWidget(index) {
  changedIndex.value = index
  widget.open();
  console.log("subiste algo", JSON.stringify(photoLink))
}


function onSubmit() {

  const data = {
    identifier: selectVal.value,
    name: accountDetails.value.name,
    description: accountDetails.value.description,
    title: accountDetails.value.title,
    accounts: []
  }

  if (selectVal.value === "first") {
    accounts.value.forEach((acc) => {
      data.accounts.push(acc)
    })
  } else {
    secondAccounts.value.forEach((acc) => {
      data.accounts.push(acc)
    })
  }



  axios.post(`${import.meta.env.VITE_SERVER}/accounts/edit`, data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(function (response) {
      const { data } = response;
      Swal.fire({
        icon: 'success',
        text: "Se editaron las cuentas correctamente"
      })
      console.log(data);
    })
    .catch(function (error) {
      if (error.response.status === 401 || error.response.status === 403) {

        Swal.fire({
          icon: 'error',
          text: "Por favor, inicie sesión"
        })
        localStorage.setItem("user", "");
        localStorage.setItem("token", "");
        router.push({ name: "login" });
      } else {
        Swal.fire({
          icon: 'error',
          text: "Hubo un error con la petición, por favor intentelo mas tarde"
        })
      }
      console.log(error.response.message);
    })

}

</script>

<template >
  <body v-jquery>

    <!--start header-->
    <header class="top-header">
      <nav class="navbar navbar-expand align-items-center justify-content-between gap-3">
        <div class="btn-toggle">
          <a href="#offcanvasPrimaryMenu" data-bs-toggle="offcanvas"><i class="material-icons-outlined">menu</i></a>
        </div>
      </nav>
    </header>
    <!--end top header-->

    <!--start mini sidebar-->
    <aside class="mini-sidebar d-flex align-items-center flex-column justify-content-between">
      <div class="user">
        <a href="#offcanvasUserDetails" data-bs-toggle="offcanvas" class="user-icon">
          <i class="material-icons-outlined">account_circle</i>
        </a>
      </div>
    </aside>
    <!--end mini sidebar-->


    <!--start main wrapper-->
    <main class="main-wrapper">
      <div class="main-content">
        <!--breadcrumb-->
        <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div class="breadcrumb-title pe-3">Dashboard</div>
          <div class="ps-3">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0 p-0">
                <li class="breadcrumb-item"><a href="javascript:;"><i class="bx bx-home-alt"></i></a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Editar Cuentas de Recaudo</li>
              </ol>
            </nav>
          </div>
        </div>
        <!--end breadcrumb-->

        <div class="row">
          <div class="col-12 col-lg-12">
            <Form @submit='onSubmit'>
              <div class="card">
                <div class="card-body p-4">
                  <div class="row mb-3">
                    <label for="input39" class="col-sm-3 col-form-label">Seleccionar Tab</label>
                    <div class="col-sm-9">
                      <select class="form-select" id="input39" v-model="selectVal">
                        <option selected value="">Elige Aquí</option>
                        <option value="first">Tab 1</option>
                        <option value="second">Tab 2</option>
                      </select>
                    </div>
                  </div>
                  <div v-if="selectVal === 'first'">
                    <div class="row mb-3">
                      <label for="" class="col-sm-3 col-form-label">Nombre del Tab</label>
                      <div class="col-sm-9">
                        <input type="text" name="name" v-model="accountDetails.name" class="form-control"
                          placeholder="Aqui va el titulo del tab">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="" class="col-sm-3 col-form-label">Titulo</label>
                      <div class="col-sm-9">
                        <input type="text" name="title" class="form-control" v-model="accountDetails.title"
                          placeholder="Aqui va el titulo de la seccion">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="" class="col-sm-3 col-form-label">Descripcion</label>
                      <div class="col-sm-9">
                        <Editor name="description" v-model="accountDetails.description"
                          api-key="2s0b75pvvp0afr2ld1tbfj1ut3rqh6lan59gojth98anpbyk" :init="{
                            plugins: ' help wordcount emoticons',
                          }"></Editor>
                      </div>
                    </div>
                    <div v-for="(ac, index) in accounts" :key="index">
                      <h5 class="mb-4">Metodo de pago {{ index + 1 }}</h5>
                      <div class="row mb-3">
                        <label for="input35" class="col-sm-3 col-form-label">Imágen Subida</label>
                        <div class="col-sm-9">
                          <img :src="ac.image" alt="" style="width: inherit;">
                        </div>
                      </div>
                      <div class="row mb-3">
                        <label for="input40" class="col-sm-3 col-form-label">Nueva Foto</label>
                        <div class="col-sm-9">
                          <input type="hidden" name="links" v-model='ac.image' />
                          <button class='btn btn-primary px-4' type='button' @click='openUploadWidget(index)'>Subir
                            Foto</button>
                        </div>
                      </div>
                      <div class="row mb-3">
                        <label for="input40" class="col-sm-3 col-form-label">Ventanilla</label>
                        <div class="col-sm-9">
                          <input type="text" class="form-control" name="btn1" v-model='ac.window' />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <label for="input40" class="col-sm-3 col-form-label">Agente</label>
                        <div class="col-sm-9">
                          <input type="text" class="form-control" name="btn1" v-model='ac.agent' />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <label for="input40" class="col-sm-3 col-form-label">En aplicativo</label>
                        <div class="col-sm-9">
                          <input type="text" class="form-control" name="btn2" v-model='ac.app' />
                        </div>
                      </div>
                      <div class="row">
                        <label class="col-sm-3 col-form-label"></label>
                        <div class="col-sm-9">
                          <div class="d-md-flex d-grid align-items-center gap-3">
                            <button type="button" class="btn btn-primary px-4" @click="addaccounts()">Añadir</button>
                            <button type="button" class="btn btn-light px-4"
                              @click="removeService(index)">Remover</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row pt-3">
                      <label class="col-sm-3 col-form-label"></label>
                      <div class="col-sm-9">
                        <div class="d-md-flex d-grid align-items-center gap-3">
                          <button type="submit" class="btn btn-primary px-4">Guardar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="selectVal === 'second'">
                    <div class="row mb-3">
                      <label for="" class="col-sm-3 col-form-label">Nombre del Tab</label>
                      <div class="col-sm-9">
                        <input type="text" name="name" v-model="accountDetails.name" class="form-control"
                          placeholder="Aqui va el titulo del tab">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="" class="col-sm-3 col-form-label">Titulo</label>
                      <div class="col-sm-9">
                        <input type="text" name="title" class="form-control" v-model="accountDetails.title"
                          placeholder="Aqui va el titulo de la seccion">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="" class="col-sm-3 col-form-label">Descripcion</label>
                      <div class="col-sm-9">
                        <Editor name="description" v-model="accountDetails.description"
                          api-key="2s0b75pvvp0afr2ld1tbfj1ut3rqh6lan59gojth98anpbyk" :init="{
                            plugins: ' help wordcount emoticons',
                          }"></Editor>
                      </div>
                    </div>
                    <div v-for="(service, index) in secondAccounts" :key="index">
                      <h5 class="mb-4">Metodo de pago {{ index + 1 }}</h5>
                      <div class="row mb-3">
                        <label for="input35" class="col-sm-3 col-form-label">Imágen Subida</label>
                        <div class="col-sm-9">
                          <img :src="service.image" alt="" style="width: inherit;">
                        </div>
                      </div>
                      <div class="row mb-3">
                        <label for="input40" class="col-sm-3 col-form-label">Nueva Foto</label>
                        <div class="col-sm-9">
                          <input type="hidden" name="links" v-model='service.image' />
                          <button class='btn btn-primary px-4' type='button' @click='openUploadWidget(index)'>Subir
                            Foto</button>
                        </div>
                      </div>
                      <div class="row mb-3">
                        <label for="input40" class="col-sm-3 col-form-label">Cuenta Soles</label>
                        <div class="col-sm-9">
                          <input type="text" class="form-control" name="btn1" v-model='service.soles' />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <label for="input40" class="col-sm-3 col-form-label">Cuenta Dolares</label>
                        <div class="col-sm-9">
                          <input type="text" class="form-control" name="btn1" v-model='service.dollars' />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <label for="input40" class="col-sm-3 col-form-label">Cuenta Interbancaria Soles</label>
                        <div class="col-sm-9">
                          <input type="text" class="form-control" name="btn2" v-model='service.interSoles' />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <label for="input40" class="col-sm-3 col-form-label">Cuenta Interbancaria Dolares</label>
                        <div class="col-sm-9">
                          <input type="text" class="form-control" name="btn2" v-model='service.interDollars' />
                        </div>
                      </div>
                      <div class="row">
                        <label class="col-sm-3 col-form-label"></label>
                        <div class="col-sm-9">
                          <div class="d-md-flex d-grid align-items-center gap-3">
                            <button type="button" class="btn btn-primary px-4" @click="addSecond()">Añadir</button>
                            <button type="button" class="btn btn-light px-4"
                              @click="removeAccount(index)">Remover</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row pt-3">
                      <label class="col-sm-3 col-form-label"></label>
                      <div class="col-sm-9">
                        <div class="d-md-flex d-grid align-items-center gap-3">
                          <button type="submit" class="btn btn-primary px-4">Guardar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="row">
                      <div class="col-sm-9">
                        <p>Elija la opcion a editar por favor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>

          </div>


        </div><!--end row-->

      </div>
    </main>
    <!--end main wrapper-->

    <!--start cart-->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCart">
      <div class="offcanvas-header border-bottom h-70">
        <h5 class="mb-0" id="offcanvasRightLabel">8 New Orders</h5>
        <a href="javascript:;" class="primaery-menu-close" data-bs-dismiss="offcanvas">
          <i class="material-icons-outlined">close</i>
        </a>
      </div>
      <div class="offcanvas-body p-0">
        <div class="order-list">
          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">White Men Shoes</h5>
              <p class="mb-0 order-price">$289</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Red Airpods</h5>
              <p class="mb-0 order-price">$149</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Men Polo Tshirt</h5>
              <p class="mb-0 order-price">$139</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Blue Jeans Casual</h5>
              <p class="mb-0 order-price">$485</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Fancy Shirts</h5>
              <p class="mb-0 order-price">$758</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Home Sofa Set </h5>
              <p class="mb-0 order-price">$546</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Black iPhone</h5>
              <p class="mb-0 order-price">$1049</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Goldan Watch</h5>
              <p class="mb-0 order-price">$689</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>
        </div>
      </div>
      <div class="offcanvas-footer h-70 p-3 border-top">
        <div class="d-grid">
          <button type="button" class="btn btn-dark" data-bs-dismiss="offcanvas">View Products</button>
        </div>
      </div>
    </div>
    <!--end cart-->

    <!--start primary menu offcanvas-->
    <OffCanvas></OffCanvas>
    <!--end primary menu offcanvas-->


    <!--start user details offcanvas-->
    <UserCanvas></UserCanvas>
    <!--end user details offcanvas-->


  </body>
</template>
  
<style>
.red {
  color: rgb(128, 2, 27);
}
</style>
