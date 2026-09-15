function showGlobalContext() {
  return this;
}
console.log('Gọi showGlobalContext():', typeof showGlobalContext() !== 'undefined' ? '[Global Object]' : 'undefined');

const developer = {
  name: 'Trọng Hùng',
  role: 'Junior Fullstack Web Developer',
  introduce() {
    console.log(`Xin chào, tôi là ${this.name}, vị trí ${this.role}.`);
  }
};

developer.introduce();

const detachedIntroduce = developer.introduce;

try {
  detachedIntroduce();
} catch (e) {
  console.log('Lỗi:', e.message);
}

const anotherDev = { name: 'Goku', role: 'Tech Lead' };
developer.introduce.call(anotherDev);

function logWork(hours, project) {
  console.log(`${this.name} đã làm việc ${hours} giờ cho dự án [${project}].`);
}
logWork.apply(developer, [8, 'E-Commerce Platform']);

const boundIntroduce = developer.introduce.bind(developer);
boundIntroduce();

function Product(id, name, price) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.getInfo = function () {
    return `[#${this.id}] ${this.name} - $${this.price}`;
  };
}

const laptop = new Product(101, 'MacBook Pro M3', 1999);
console.log('Sản phẩm tạo từ new:', laptop.getInfo());

const timerService = {
  serviceName: 'Notification Worker',
  tasks: ['Backup DB', 'Send Welcome Email', 'Sync Analytics'],

  startTasks() {
    console.log(`Bắt đầu service: ${this.serviceName}`);
    this.tasks.forEach((task, index) => {
      console.log(`[${this.serviceName}] Tác vụ ${index + 1}: ${task}`);
    });
  }
};

timerService.startTasks();

const quizObj = {
  val: 42,
  regularFn: function () {
    return this.val;
  },
  arrowFn: () => {
    return this ? this.val : undefined;
  }
};

console.log('1. quizObj.regularFn():', quizObj.regularFn());
console.log('2. quizObj.arrowFn():', quizObj.arrowFn());

const nestedObj = {
  val: 99,
  getNested() {
    const innerArrow = () => this.val;
    return innerArrow();
  }
};
console.log('3. nestedObj.getNested():', nestedObj.getNested());
