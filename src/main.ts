import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router/router.ts'
import {
    Affix, Avatar, Badge, Breadcrumb,
    Button,
    Card, Carousel, Cascader,
    Checkbox,
    Col, Collapse, DatePicker,
    Form, Image,
    Input, InputNumber,
    Layout,
    Menu, Modal, Pagination, Popover,
    Radio, Rate, Result,
    Row,
    Select,
    Space,
    Table, Tabs, Upload
} from "ant-design-vue";

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Space)
app.use(Col)
app.use(Row)
app.use(Card)
app.use(Button)
app.use(Select)
app.use(Input)
app.use(Layout)
app.use(Form)
app.use(Checkbox)
app.use(Radio)
app.use(Menu)
app.use(Table)
app.use(Affix)
app.use(Breadcrumb)
app.use(Cascader)
app.use(Avatar)
app.use(Badge)
app.use(Carousel)
app.use(Tabs)
app.use(Popover)
app.use(Result)
app.use(Modal)
app.use(Upload)
app.use(Image)
app.use(Rate)
app.use(InputNumber)
app.use(DatePicker)
app.use(Collapse)
app.use(Pagination)

app.mount('#app')
