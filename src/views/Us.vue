<script setup>
import OffCanvas from '../components/OffCanvas.vue';
import UserCanvas from '../components/UserCanvas.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import Swal from 'sweetalert2';
import router from "../router/index"
import '@vuepic/vue-datepicker/dist/main.css'
import { getUserData } from '../helper/auth';


const body = ref('');
const userData = getUserData();

const mission = ref('')
const vission = ref('')
const educationComittePresident = ref('')
const educationComitteSecretary = ref('')
const educationComitteVice = ref('')
const educationComitteVocal = ref('')
const electoralComittePresident = ref('')
const electoralComitteSecretary = ref('')
const electoralComitteVice = ref('')
const electoralComitteVocal = ref('')
const administracionCouncelPresident = ref('')
const administracionCouncelSecretary = ref('')
const administracionCouncelVice = ref('')
const administracionCouncelVocal = ref('')
const administracionCouncel2Vocal = ref('')
const administracionCouncel3Vocal = ref('')
const vigilanceCouncelPresident = ref('')
const vigilanceCouncelSecretary = ref('')
const vigilanceCouncelVice = ref('')
const vigilanceCouncelVocal = ref('')

onMounted(async () => {
  try {
    axios.get(`${import.meta.env.VITE_SERVER}/us`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(function (response) {
        const { data } = response;

        mission.value = data.mission;
        vission.value = data.vission;
        educationComittePresident.value = data.educationCommitte.president;
        educationComitteSecretary.value = data.educationCommitte.secretary;
        educationComitteVice.value = data.educationCommitte.vicepresident;
        educationComitteVocal.value = data.educationCommitte.vocal;
        electoralComittePresident.value = data.electoralCommitte.president;
        electoralComitteSecretary.value = data.electoralCommitte.secretary;
        electoralComitteVice.value = data.electoralCommitte.vicepresident;
        electoralComitteVocal.value = data.electoralCommitte.vocal;
        administracionCouncelPresident.value = data.administracionCouncel.president;
        administracionCouncelSecretary.value = data.administracionCouncel.secretary;
        administracionCouncelVice.value = data.administracionCouncel.vicepresident;
        administracionCouncelVocal.value = data.administracionCouncel.firstVocal;
        administracionCouncel2Vocal.value = data.administracionCouncel.secondVocal;
        administracionCouncel3Vocal.value = data.administracionCouncel.thirdVocal;
        vigilanceCouncelPresident.value = data.vigilanceCouncel.president;
        vigilanceCouncelSecretary.value = data.vigilanceCouncel.secretary;
        vigilanceCouncelVice.value = data.vigilanceCouncel.vicepresident;
        vigilanceCouncelVocal.value = data.vigilanceCouncel.vocal;
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


const schema = yup.object({
  mission: yup.string("Deber ser texto").required("Mision requerida"),
  vission: yup.string("Deber ser texto").required("Vision requerida"),
  educationComittePresident: yup.string("Deber ser texto").required("Presidente requerido"),
  educationComitteSecretary: yup.string("Deber ser texto").required("Secretaria requerido"),
  educationComitteVice: yup.string("Deber ser texto").required("Vicepresidente requerido"),
  educationComitteVocal: yup.string("Deber ser texto").required("Vocal requerido"),
  electoralComittePresident: yup.string("Deber ser texto").required("Presidente requerido"),
  electoralComitteSecretary: yup.string("Deber ser texto").required("Secretaria requerido"),
  electoralComitteVice: yup.string("Deber ser texto").required("Vicepresidente requerido"),
  electoralComitteVocal: yup.string("Deber ser texto").required("Vocal requerido"),
  administracionCouncelPresident: yup.string("Deber ser texto").required("Presidente requerido"),
  administracionCouncelSecretary: yup.string("Deber ser texto").required("Secretaria requerido"),
  administracionCouncelVice: yup.string("Deber ser texto").required("Vicepresidente requerido"),
  administracionCouncelVocal: yup.string("Deber ser texto").required("Vocal requerido"),
  administracionCouncel2Vocal: yup.string("Deber ser texto").required("Vocal requerido"),
  administracionCouncel3Vocal: yup.string("Deber ser texto").required("Vocal requerido"),
  vigilanceCouncelPresident: yup.string("Deber ser texto").required("Presidente requerido"),
  vigilanceCouncelSecretary: yup.string("Deber ser texto").required("Secretaria requerido"),
  vigilanceCouncelVice: yup.string("Deber ser texto").required("Vicepresidente requerido"),
  vigilanceCouncelVocal: yup.string("Deber ser texto").required("Vocal requerido"),
})

function onSubmit(values, { resetForm }) {

  console.log(values);
  axios.post(`${import.meta.env.VITE_SERVER}/us`, values, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(function (response) {
      const { data } = response;
      Swal.fire({
        icon: 'success',
        text: "Se edito nosotros correctamente"
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
                <li class="breadcrumb-item active" aria-current="page">Editar Nosotros</li>
              </ol>
            </nav>
          </div>
          <div class="ms-auto">
            <div class="btn-group">
              <button type="button" class="btn btn-primary">Settings</button>
              <button type="button" class="btn btn-primary split-bg-primary dropdown-toggle dropdown-toggle-split"
                data-bs-toggle="dropdown"> <span class="visually-hidden">Toggle Dropdown</span>
              </button>
              <div class="dropdown-menu dropdown-menu-right dropdown-menu-lg-end"> <a class="dropdown-item"
                  href="javascript:;">Action</a>
                <a class="dropdown-item" href="javascript:;">Another action</a>
                <a class="dropdown-item" href="javascript:;">Something else here</a>
                <div class="dropdown-divider"></div> <a class="dropdown-item" href="javascript:;">Separated link</a>
              </div>
            </div>
          </div>
        </div>
        <!--end breadcrumb-->

        <div class="row">
          <div class="col-12 col-lg-12">
            <Form @submit='onSubmit' :validation-schema="schema" v-slot="{ values }">
              <div class="card">
                <div class="card-body p-4">
                  <h5 class="mb-4">Comite de Educacion</h5>
                  <div class="row mb-3">
                    <label for="input35" class="col-sm-3 col-form-label">Mision</label>
                    <div class="col-sm-9">
                      <Field name='mission' v-model="mission" class="form-control" id="input35" placeholder="Mision"
                        as="textarea">
                      </Field>
                      <ErrorMessage class="red" name="mission" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input36" class="col-sm-3 col-form-label">Vision</label>
                    <div class="col-sm-9">
                      <Field name='vission' v-model="vission" class="form-control" id="input36" placeholder="Vision"
                        as="textarea">
                      </Field>
                      <ErrorMessage class="red" name="vission" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input37" class="col-sm-3 col-form-label">Presidente</label>
                    <div class="col-sm-9">
                      <Field name='educationComittePresident' v-model="educationComittePresident" type="text"
                        class="form-control" id="input37" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="educationComittePresident" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input38" class="col-sm-3 col-form-label">Secretaria</label>
                    <div class="col-sm-9">
                      <Field name='educationComitteSecretary' v-model="educationComitteSecretary" type="text"
                        class="form-control" id="input38" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="educationComitteSecretary" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input39" class="col-sm-3 col-form-label">VicePresidente</label>
                    <div class="col-sm-9">
                      <Field name='educationComitteVice' type="text" v-model="educationComitteVice" class="form-control"
                        id="input39" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="educationComitteVice" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input40" class="col-sm-3 col-form-label"> 1er Vocal </label>
                    <div class="col-sm-9">
                      <Field name='educationComitteVocal' v-model="educationComitteVocal" type="text" class="form-control"
                        id="input40" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="educationComitteVocal" />
                    </div>
                  </div>
                  <h5 class="mb-4">Comite de Electoral</h5>
                  <div class="row mb-3">
                    <label for="input37" class="col-sm-3 col-form-label">Presidente</label>
                    <div class="col-sm-9">
                      <Field name='electoralComittePresident' v-model="electoralComittePresident" type="text"
                        class="form-control" id="input37" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="electoralComittePresident" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input38" class="col-sm-3 col-form-label">Secretaria</label>
                    <div class="col-sm-9">
                      <Field name='electoralComitteSecretary' v-model="electoralComitteSecretary" type="text"
                        class="form-control" id="input38" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="electoralComitteSecretary" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input39" class="col-sm-3 col-form-label">VicePresidente</label>
                    <div class="col-sm-9">
                      <Field name='electoralComitteVice' v-model="electoralComitteVice" type="text" class="form-control"
                        id="input39" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="electoralComitteVice" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input40" class="col-sm-3 col-form-label"> 1er Vocal </label>
                    <div class="col-sm-9">
                      <Field name='electoralComitteVocal' v-model="electoralComitteVocal" type="text" class="form-control"
                        id="input40" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="electoralComitteVocal" />
                    </div>
                  </div>
                  <h5 class="mb-4">Consejo de Administracion</h5>
                  <div class="row mb-3">
                    <label for="input37" class="col-sm-3 col-form-label">Presidente</label>
                    <div class="col-sm-9">
                      <Field name='administracionCouncelPresident' v-model="administracionCouncelPresident" type="text"
                        class="form-control" id="input37" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="administracionCouncelPresident" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input38" class="col-sm-3 col-form-label">Secretaria</label>
                    <div class="col-sm-9">
                      <Field name='administracionCouncelSecretary' v-model="administracionCouncelSecretary" type="text"
                        class="form-control" id="input38" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="administracionCouncelSecretary" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input39" class="col-sm-3 col-form-label">VicePresidente</label>
                    <div class="col-sm-9">
                      <Field name='administracionCouncelVice' v-model="administracionCouncelVice" type="text"
                        class="form-control" id="input39" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="administracionCouncelVice" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input40" class="col-sm-3 col-form-label"> 1er Vocal </label>
                    <div class="col-sm-9">
                      <Field name='administracionCouncelVocal' v-model="administracionCouncelVocal" type="text"
                        class="form-control" id="input40" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="administracionCouncelVocal" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input40" class="col-sm-3 col-form-label"> 2do Vocal </label>
                    <div class="col-sm-9">
                      <Field name='administracionCouncel2Vocal' v-model="administracionCouncel2Vocal" type="text"
                        class="form-control" id="input40" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="administracionCouncel2Vocal" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input40" class="col-sm-3 col-form-label"> 3er Vocal </label>
                    <div class="col-sm-9">
                      <Field name='administracionCouncel3Vocal' v-model="administracionCouncel3Vocal" type="text"
                        class="form-control" id="input40" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="administracionCouncel3Vocal" />
                    </div>
                  </div>
                  <h5 class="mb-4">Consejo de Vigilancia</h5>
                  <div class="row mb-3">
                    <label for="input37" class="col-sm-3 col-form-label">Presidente</label>
                    <div class="col-sm-9">
                      <Field name='vigilanceCouncelPresident' v-model="vigilanceCouncelPresident" type="text"
                        class="form-control" id="input37" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="vigilanceCouncelPresident" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input38" class="col-sm-3 col-form-label">Secretaria</label>
                    <div class="col-sm-9">
                      <Field name='vigilanceCouncelSecretary' v-model="vigilanceCouncelSecretary" type="text"
                        class="form-control" id="input38" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="vigilanceCouncelSecretary" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input39" class="col-sm-3 col-form-label">VicePresidente</label>
                    <div class="col-sm-9">
                      <Field name='vigilanceCouncelVice' v-model="vigilanceCouncelVice" type="text" class="form-control"
                        id="input39" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="vigilanceCouncelVice" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input40" class="col-sm-3 col-form-label"> 1er Vocal </label>
                    <div class="col-sm-9">
                      <Field name='vigilanceCouncelVocal' v-model="vigilanceCouncelVocal" type="text" class="form-control"
                        id="input40" placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="vigilanceCouncelVocal" />
                    </div>
                  </div>
                  <div class="row">
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
