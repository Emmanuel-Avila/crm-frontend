<template>
  <div class="row">
    <div class="col-xl-12 mx-auto">
      <h6 class="mb-0 text-uppercase">File input</h6>
      <hr>
      <div class="card">
        <div class="card-body">
          <div class="mb-3">
            <label for="formFile" class="form-label">Archivo</label>
            <input class="form-control" type="file" id="formFile" @change="handleFileChange">
          </div>
          <div class="mb-3">
            <label class="form-label">Nombre visible del archivo</label>
            <input class="form-control" type="text" placeholder='Nombre aquí' id="textInput" v-model="text"
              @blur="validateFields">
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label"></label>
            <div class="col-md-9">
              <div class="d-md-flex d-grid align-items-center gap-3">
                <button type="button" class="btn btn-primary px-4">Submit</button>
                <button type="button" class="btn btn-light px-4">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end row-->
</template>

<script>
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

export default {
  props: {
    textValue: {
      type: String,
      required: true,
    },
    fileValue: {
      type: File,
      required: true,
    },
    updateTextValue: {
      type: Function,
      required: true,
    },
    updateFileValue: {
      type: Function,
      required: true,
    },
    textValidation: {
      type: yup.mixed().required('Texto es requerido'),
      required: true,
    },
    fileValidation: {
      type: yup.mixed().required('Archivo es requerido'),
      required: true,
    },
  },
  setup(props) {
    const { value: text, errorMessage: textError, validate } = useField('text', props.textValidation);
    const { errorMessage: fileError } = useField('file', props.fileValidation);

    const handleFileChange = (event) => {
      props.updateFileValue(event.target.files[0]);
      validate(); // Validar el campo al cambiar
    };

    const validateFields = () => {
      validate(); // Validar los campos al perder el foco
    };

    return {
      text,
      handleFileChange,
      textError,
      fileError,
      validateFields,
    };
  },
};
</script>