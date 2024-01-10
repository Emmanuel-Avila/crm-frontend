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



const services = ref([{ button1: '', button2: '', text: '', image: '' }])

const addServices = () => {
  services.value.push({ button1: '', button2: '', text: '', image: '' });
}

const removeService = (index) => {
  services.value.splice(index, 1)
}

const offices = ref([{ name: '', location: '', phone: '', locationLink: '' }])

const addOffices = () => {
  offices.value.push({ name: '', location: '', phone: '', locationLink: '' });
}

const removeOffice = (index) => {
  offices.value.splice(index, 1)
}


onMounted(async () => {
  try {
    axios.get(`${import.meta.env.VITE_SERVER}/office`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(function (response) {
        const { data } = response;
        console.log(data)

        if (data.offices.length > 0) {
          offices.value = data.offices.map(office => ({
            name: office.name,
            location: office.location,
            phone: office.phone,
            locationLink: office.locationLink
          }));
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
  } catch (error) {

  }
});


function onSubmit(values) {

  const postData = {
    offices: offices.value
  }
  console.log(postData)
  axios.post(`${import.meta.env.VITE_SERVER}/office`, postData, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(function (response) {
      const { data } = response;
      Swal.fire({
        icon: 'success',
        text: "Se editaron las oficinas correctamente"
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
                <li class="breadcrumb-item active" aria-current="page">Editar Oficinas</li>
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
                  <div v-for="(office, index) in offices" :key="index">
                    <h5 class="mb-4">Sede {{ index + 1 }}</h5>
                    <div class="row mb-3">
                      <label for="input40" class="col-sm-3 col-form-label">Departamento</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" name="title" v-model="office.name">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="input40" class="col-sm-3 col-form-label">Direccion</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" name="btn1" v-model='office.location' />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="input40" class="col-sm-3 col-form-label">Link de la direccion</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" name="btn2" v-model='office.locationLink' />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="input40" class="col-sm-3 col-form-label">Telefono</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" name="btn2" v-model='office.phone' />
                      </div>
                    </div>
                    <div class="row">
                      <label class="col-sm-3 col-form-label"></label>
                      <div class="col-sm-9">
                        <div class="d-md-flex d-grid align-items-center gap-3">
                          <button type="button" class="btn btn-primary px-4" @click="addOffices()">Añadir</button>
                          <button type="button" class="btn btn-light px-4" @click="removeOffice(index)">Remover</button>
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
              </div>
            </Form>

          </div>


        </div><!--end row-->

      </div>
    </main>
    <!--end main wrapper-->


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
