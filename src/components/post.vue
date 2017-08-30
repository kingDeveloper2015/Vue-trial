<template>
  <div>
    <div class="col-md-12">
      <button class="pull-left btn btn-primary" v-on:click="onAdd">Add</button>
    </div>
    <modal v-show="showModal" @add="doAdd" @update="doUpdate" v-bind:flag="updateFlag" v-bind:data="original[selIdx]" @close="onClose"></modal>
    <div class="col-md-12">
      <table>
        <thead>
          <tr>
            <th v-on:click="doSort('id')" width="5%">ID</th>
            <th v-on:click="doSort('userId')" width="5%">User ID</th>
            <th v-on:click="doSort('title')" width="20%">Title</th>
            <th v-on:click="doSort('body')" width="50%">Description</th>
            <th v-on:click="doSort('date')" width="15%">Date</th>
            <th width="5%">Func</th>
          </tr>
          <tr>
            <th></th>
            <th><multiselect v-model="filterOption.userId" :options="userList" :multiple="true"></multiselect></th>
            <th><input class="form-control" v-model="filterOption.title"></th>
            <th><input class="form-control" v-model="filterOption.body"></th>
            <th><datepicker v-model="filterOption.dateRange" min="2015-01-01" :range="true"></datepicker></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in posts">
            <td>{{post.id}}</td>
            <td>{{post.userId}}</td>
            <td>{{post.title}}</td>
            <td>{{post.body}}</td>
            <td>{{post.date}}</td>
            <td>
              <div style="display: inline-flex;">
                <button class="btn btn-small btn-primary" v-on:click="onUpdate(post.id - 1)">Edit</button>
                <button class="btn btn-small btn-warning" v-on:click="onRemove(post.id - 1)">Remove</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import lodash from 'lodash'
  import modal from './modal.vue'
  import Multiselect from 'vue-multiselect'
  import datepicker from 'vue-date'
  export default {
    data () {
      return {
        posts: [],
        original: [],
        userList: [],
        showModal: false,
        updateFlag: false,
        selIdx: -1,
        sort: {
          id: 'asc',
          userId: 'asc',
          title: 'asc',
          body: 'asc',
          date: 'asc'
        },
        filterOption: {
          title: '',
          body: '',
          userId: [],
          dateRange: []
        }
      }
    },
    watch: {
      filterOption: {
        handler: function (option) {
          this.doFilter(option)
        },
        deep: true
      },
      original: {
        handler: function (newList) {
          var temp = []
          for (var i = 0; i < newList.length; i++) {
            if (temp.indexOf(newList[i].userId) === -1) {
              temp.push(newList[i].userId)
            }
          }
          this.userList = temp
          this.doFilter(this.filterOption)
        },
        deep: true
      }
    },
    methods: {
      doFilter: function (option) {
        var temp = []
        var minDate = option.dateRange[0] === '' ? '2017-01-01' : option.dateRange[0]
        var maxDate = option.dateRange[1] === '' ? '2017-12-31' : option.dateRange[1]
        for (var i = 0; i < this.original.length; i++) {
          var title = this.original[i].title
          var body = this.original[i].body
          var userId = this.original[i].userId
          var date = new Date(this.original[i].date)
          if (title.includes(option.title) === true && body.includes(option.body) === true) {
            if (this.filterOption.userId.length === 0 || this.filterOption.userId.indexOf(userId) !== -1) {
              if (new Date(minDate) < date && new Date(maxDate) > date) {
                temp.push(this.original[i])
              }
            }
          }
        }
        this.posts = temp
      },
      doSort: function (field) {
        if (this.sort[field] === 'asc') {
          this.sort[field] = 'desc'
        } else {
          this.sort[field] = 'asc'
        }
        this.posts = lodash.orderBy(this.posts, [field], [this.sort[field]])
      },
      onSetDate: function (index) {
        this.posts[index].date = this.generateRandate()
      },
      generateRandate: function () {
        var timeS = Math.floor(Math.random() * 10000000000 + 1490000000000)
        var dDate = new Date(timeS)
        return dDate.toLocaleDateString()
      },
      onAdd: function () {
        this.selIdx = -1
        this.updateFlag = false
        this.showModal = true
      },
      onUpdate: function (index) {
        this.selIdx = index
        this.updateFlag = true
        this.showModal = true
      },
      onRemove: function (index) {
        var $this = this
        axios.delete(`http://jsonplaceholder.typicode.com/posts/1`, {
          id: index + 1
        }).then(res => {
          $this.original.splice(index, 1)
          $this.showModal = false
        })
      },
      onClose: function () {
        this.showModal = false
      },
      doAdd: function (data) {
        var $this = this
        axios.post(`http://jsonplaceholder.typicode.com/posts`, {
          title: data.title,
          body: data.body,
          userId: data.userId
        }).then(response => {
          $this.showModal = false
          $this.original.push({
            id: response.data.id,
            title: response.data.title,
            body: response.data.body,
            userId: response.data.userId,
            date: $this.generateRandate()
          })
        })
      },
      doUpdate: function (data) {
        var $this = this
        axios.put(`http://jsonplaceholder.typicode.com/posts/1`, {
          id: $this.selIdx + 1,
          title: data.title,
          userId: data.userId,
          body: data.body
        }).then(res => {
          $this.showModal = false
          $this.original[$this.selIdx].userId = res.data.userId
          $this.original[$this.selIdx].body = res.data.body
          $this.original[$this.selIdx].title = res.data.title
        })
      }
    },
    created () {
      var $this = this
      axios.get(`http://jsonplaceholder.typicode.com/posts`)
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].date = $this.generateRandate()
        }
        $this.posts = response.data
        $this.original = response.data
      })
      .catch(e => {
      })
    },
    components: {
      'modal': modal,
      Multiselect,
      datepicker
    }
  }
</script>
<style>
th {
  text-align: center !important;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>
