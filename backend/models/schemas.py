from pydantic import BaseModel
from typing import List, Optional
from fastapi_users import schemas
from datetime import datetime, date
from fastapi_users import FastAPIUsers, fastapi_users


# class UserRead(schemas.BaseUser[int]):
#     id: int
#     username: str
#     is_active: bool = True
#     is_superuser: bool = False
#     is_verified: bool = False

#     class Config:
#         orm_mode = True

# class UserCreate(schemas.BaseUserCreate):
#     username: str
#     fio: str
#     schoolname: str
#     password: str
#     is_active: Optional[bool] = True
#     is_superuser: Optional[bool] = False
#     is_verified: Optional[bool] = False

# class ScoreCheck(BaseModel):
#     answer: str

# class TaskCheck(BaseModel):
#     first_task: bool
#     second_task: bool
#     third_task: bool
#     fourth_task: bool
#     fifth_task: bool

# class UserInfo(BaseModel):
#     username: str
#     schoolname: str
#     email: str

class UserRead(schemas.BaseUser[int]):
    id: int
    email: str
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False

    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    id: int
    email: str
    username: str  

    class Config:
        orm_mode = True

class UserCreate(schemas.BaseUserCreate):
    f_name: str
    s_name: str
    t_name: str
    contact_number: str
    organization_name: str
    description: str
    size: str
    branch: str
    password: str
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    is_verified: Optional[bool] = False


class ContactPersonCreate(BaseModel):
    f_name: str
    s_name: str
    t_name: str
    post: str
    contact_number: str
    email: str
    customer_id:  int
class ContactPersonRead(BaseModel):
    f_name: str
    s_name: str
    t_name: str
    post: str
    contact_number: str
    email: str


class CustomerCreate(BaseModel):
    organization_name: str
    description: str 
    size: str
    branch: str

class CustomerRead(BaseModel):
    id: int
    organization_name: str
    description: str 
    size: str
    branch: str

class CreateEmployee(BaseModel):
    f_name: str 
    s_name: str 
    t_name: str
    birthday: date
    contact_number: str
    email: str
    description:  str
    education_data: str
    spec: str
 

class TaskCreate(BaseModel):
    name: str
    description: str
    deadline: date

class TaskRead(BaseModel):
    id: int
    name: str
    description: str
    deadline: date
    status: str

class ProjectCreate(BaseModel):
    name: str
    create_at: date
    deadline: date
    description: str
    budget: int
    customer: str      #решили вопрос, готовая схема
    team_leader: str #создать апи для вывода всех сотрудников проекта одного мужика
    status: str
    customer_id: int
    
class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str
    create_at: date
    deadline: date
    budget: int
    customer: str
    team_leader: str
    status: str
    hard_skill: List[str]
    soft_skill: List[str]

    class Config:
        orm_mode = True

class EmployeeResponse(BaseModel):
    id: int
    f_name: str
    s_name: str
    t_name: str
    birthday: date
    contact_number: str
    email: str
    description:  str
    education_data: str
    spec: str
    status: str
    hard_skill: List[str]
    soft_skill: List[str]

    class Config:
        orm_mode = True

class CreateHardSkill(BaseModel):
    name: str
    title: str

class CreateSoftSkill(BaseModel):
    name: str
    title: str

class ResponseHardSkill(BaseModel):
    id:int
    name: str
    title: str

    class Config:
        orm_mode = True
class ResponseSoftSkill(BaseModel):
    id:int
    name: str
    title: str

    class Config:
        orm_mode = True

class Create_Employe_Project(BaseModel):
    employee_id: int
    project_id:int
    status: bool









































# class ItemBase(BaseModel): # Схемы описывают те данные, которые отдаются клиенту
#     title: str
#     description: Optional[str] = None

# class ItemCreate(ItemBase):
#     pass

# class Item(ItemBase):
#     id: int
#     owner_id: int

#     class Config: 
#         orm_mode = True

# class UserBase(BaseModel): # самая базовая схема, наследуется от базовой модели pydantic
#     email: str # используется всегда, когда мы имеем дело с user ()когда мы его создаем, выводим или меняем)

# class UserCreate(UserBase): # наследуется от UserBase, т.е. будет требоваться еще и пароль
#     password: str # помимо email, сам метод подразумевается для создания user'а

# class User(UserBase): # метод для чтения, не показывает пароль и наследуется от UserBase
#     id: int
#     is_active: bool
#     items: List[Item] = []

#     class Config: # создается для того, чтобы pydantic понимал, что работает с ORM - SQLAlchemy
#         orm_mode = True