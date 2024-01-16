<script setup>
import OffCanvas from '../components/OffCanvas.vue';
import UserCanvas from '../components/UserCanvas.vue';
import Editor from '@tinymce/tinymce-vue';
import { ref, watch } from 'vue';
import { Form } from 'vee-validate'
import axios from 'axios';
import Swal from 'sweetalert2';
import router from "../router/index"

const TINY_API_KEY = import.meta.env.VITE_TINY_CLOUD_KEY;

const selectVal = ref('');
const addIndex = ref([]);
const cancelBtnisDisabled = ref(false);
const addBtnisDisabled = ref(false);

const initialSection = { inputValue: '' };
const sections = ref([{ inputValue: '' }]);

const benefitsO = { benefits: '' };
const benefitSections = ref([{ benefits: '' }])

const requirements = { text: '' };
const requirementsSection = ref([{ text: '' }])

const addBenefits = () => {
  benefitSections.value.push({ ...benefitsO });
  console.log(benefitSections)
}

const removeBenefits = (index) => {
  benefitSections.value.splice(index, 1)
}

const addRequirements = () => {
  requirementsSection.value.push({ ...requirements });
  console.log(benefitSections)
}

const removeRequirements = (index) => {
  requirementsSection.value.splice(index, 1)
}

const addSection = () => {
  cancelBtnisDisabled.value = true
  sections.value.push({ ...initialSection });

};

const removeSection = (index) => {
  addBtnisDisabled.value = true
  sections.value.splice(index, 1);
};

const handleChange = (index) => {
  console.log(index);
  addIndex.value.push(index);
}


watch(selectVal, (newVal, oldVal) => {
  if (newVal.trim() !== "") {

    axios.get(`${import.meta.env.VITE_SERVER}/products/${newVal}`,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
      .then(response => {
        benefitSections.value = response.data.benefits.map(benefit => { return { benefits: benefit } });
        requirementsSection.value = response.data.requirements.map(requirement => { return { text: requirement } });
        sections.value = response.data.documents.map(document => { return { inputValue: document.name } });
        document.getElementById("details").value = response.data.details;
        console.log(requirementsSection.value)
      })
      .catch(function (error) {
        console.log(error);
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
        console.log(error);
      })
  }
})



function onSubmit() {
  const formData = new FormData();

  const fileInputs = document.querySelectorAll("input[name='files']")
  const textInputs = document.querySelectorAll("input[name='documentNames']")

  const documentNames = [];
  const files = [];

  fileInputs.forEach((input) => {
    const fileList = input.files;
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i])
      files.push(fileList[i]);
    }
  });
  textInputs.forEach((input) => {
    const value = input.value;
    documentNames.push(value);
    formData.append("documentNames", input.value);
  });
  requirementsSection.value.forEach((requi) => {
    formData.append("requirements", requi.text)
  });
  benefitSections.value.forEach((bene) => {
    formData.append("benefits", bene.benefits)
  });


  formData.append("details", document.querySelector("textarea[name='details']").value);
  formData.append("name", document.querySelector("#input39").value);

  if (addIndex.value.length !== 0) {

    formData.append("addIndexs", JSON.stringify(addIndex.value))
  } else {
    formData.append("addIndexs", JSON.stringify([]));
  }

  console.log(formData);

  axios.post(`${import.meta.env.VITE_SERVER}/products`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(function (response) {
      const { data } = response;
      Swal.fire({
        icon: 'success',
        text: "Se editó el producto correctamente"
      })
      location.reload()
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
      console.log(error);
    })
}
</script>

<template>
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
              <li class="breadcrumb-item active" aria-current="page">Editar Productos</li>
            </ol>
          </nav>
        </div>
      </div>

      <Form @submit='onSubmit'>

        <div class="row">
          <div class="col-12 col-lg-12">
            <div class="card">
              <div class="card-body p-4">
                <h5 class="mb-4">Editar Producto</h5>
                <div class="row mb-3">
                  <label for="input39" class="col-sm-3 col-form-label">Seleccionar Producto</label>
                  <div class="col-sm-9">
                    <select class="form-select" id="input39" v-model="selectVal">
                      <option selected="">Elige Aquí</option>
                      <option value="maximas">Máximas</option>
                      <option value="postgraduate">Posgrado</option>
                      <option value="digitalFamily">Familia Digital</option>
                      <option value="canceldebt">Cancela Deuda</option>
                      <option value="vehicle">Vehicular</option>
                      <option value="improve">Mejora tu Vivienda</option>
                      <option value="liquidguarantee">Garantía Líquida</option>
                      <option value="freeSavings">Ahorro Libre</option>
                      <option value="childSavings">Educaahorro</option>
                      <option value="stockWork">Capital Trabajo</option>
                      <option value="activeBusiness">Activo Negocio</option>
                      <option value="mypeVehicle">Vehicular Mype</option>
                      <option value="fixedTerm">Plazo Fijo</option>
                      <option value="fixedTermSenior">Plazo Fijo Senior</option>
                    </select>
                  </div>
                </div>
                <div class="row mb-3" v-for="(benefit, index) in benefitSections" :key="index">
                  <label for="input37" class="col-sm-3 col-form-label">Beneficios</label>
                  <div class="col-sm-9">
                    <Editor name='benefits' v-model="benefit.benefits" :api-key="TINY_API_KEY" :init="{
                      plugins: ' help wordcount emoticons', height: 150
                    }"></Editor>
                  </div>
                  <div class="d-md-flex d-grid align-items-center gap-3">
                    <button type="button" class="btn btn-primary px-4" @click.prevent="addBenefits">Añadir</button>
                    <button type="button" class="btn btn-light px-4" @click="removeBenefits(index)">Quitar
                      elemento</button>
                  </div>
                </div>
                <div class="row mb-3" v-for="(requirement, index) in requirementsSection" :key="index">
                  <label for="input37" class="col-sm-3 col-form-label">Requerimientos</label>
                  <div class="col-sm-9">
                    <Editor name='requirements' v-model="requirement.text" :api-key="TINY_API_KEY" :init="{
                      plugins: 'lists link image table code help wordcount media emoticons', height: 150
                    }"></Editor>
                  </div>
                  <div class="d-md-flex d-grid align-items-center gap-3">
                    <button type="button" class="btn btn-primary px-4" @click.prevent="addRequirements">Añadir</button>
                    <button type="button" class="btn btn-light px-4" @click="removeRequirements(index)">Quitar
                      elemento</button>
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="input40" class="col-sm-3 col-form-label">Detalles</label>
                  <div class="col-sm-9">
                    <textarea class="form-control" id="details" rows="3" placeholder="Detalles" name="details"></textarea>
                  </div>
                </div>
              </div>
            </div>

          </div>


        </div><!--end row-->

        <!--end breadcrumb-->
        <div class="row">
          <div class="col-xl-12 mx-auto">
            <h6 class="mb-0 text-uppercase">Archivos</h6>
            <hr>
            <div class="card">
              <div class="card-body" v-for="( section, index ) in  sections " :key="index">
                <div class="mb-3">
                  <label for="formFile" class="form-label">Archivo</label>
                  <input class="form-control" type="file" @change="handleChange(index)" @blur="handleBlur"
                    :id="'files_' + index" name="files" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Nombre visible del archivo</label>
                  <input type="text" v-model="section.inputValue" class="form-control" name="documentNames"
                    placeholder="Nombre aquí" required>
                </div>
                <div class="row">
                  <label class="col-md-3 col-form-label"></label>
                  <div class="col-md-9">
                    <div class="d-md-flex d-grid align-items-center gap-3">
                      <button type="button" class="btn btn-primary px-4" @click.prevent="addSection"
                        :disabled="addBtnisDisabled">Añadir</button>
                      <button type="button" class="btn btn-light px-4" @click="removeSection(index)"
                        :disabled="cancelBtnisDisabled">Quitar
                        elemento</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 text-center">
                  <div class="d-md-flex d-grid align-items-center gap-3 text-center">
                    <button type="submit" class="btn btn-primary px-4">Guardar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </Form>
    </div>
  </main>
  <!--end main wrapper-->



  <!--start primary menu offcanvas-->
  <OffCanvas></OffCanvas>
  <!--end primary menu offcanvas-->


  <!--start user details offcanvas-->
  <UserCanvas></UserCanvas>
  <!--end user details offcanvas-->
</template>