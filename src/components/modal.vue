<template>
  <div>
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header">
                POST Information {{id == -1 ? '' : id}}
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
                <div class="row">
                  <div class="col-sm-12">
                    <input class="form-control" placeholder="UserId" type="number" v-model='userId'>
                    <input class="form-control" placeholder="Title ... " v-model='title'>
                    <input class="form-control" placeholder="Body ...." v-model='body'>
                  </div>
                </div>
              </slot>
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <button class="modal-default-button btn btn-default" v-on:click="onCancel()">Cancel</button>
                <button class="modal-default-button btn btn-primary" v-on:click="onAction()">OK</button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        id: -1,
        userId: 1,
        title: '',
        body: '',
        updateFlag: false
      }
    },
    props: ['flag', 'data'],
    watch: {
      data: function (data) {
        console.log(this.updateFlag)
        if (!data) {
          this.id = -1
          this.userId = 1
          this.title = ''
          this.body = ''
        } else {
          this.id = data.id
          this.userId = data.userId
          this.title = data.title
          this.body = data.body
        }
      },
      flag: function (data) {
        console.log(data)
        this.updateFlag = data
      }
    },
    methods: {
      onAction: function () {
        console.log(this.flag)
        console.log(this.data)
        if (this.flag === false) {
          this.$emit('add', {
            userId: this.userId,
            title: this.title,
            body: this.body
          })
        } else {
          this.$emit('update', {
            userId: this.userId,
            title: this.title,
            body: this.body
          })
        }
      },
      onCancel: function () {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}
</style>
