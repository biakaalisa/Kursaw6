from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, TIMESTAMP, Float,Table, MetaData
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped, mapped_column, relationship
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime, date
from typing import List, Optional
from time import time
# metadata = MetaData()
class Base(DeclarativeBase):
    pass                            

class User(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    f_name: Mapped[str] = mapped_column(String, nullable=False)
    s_name: Mapped[str] = mapped_column(String, nullable=False)
    t_name: Mapped[str] = mapped_column(String, nullable=False)
    contact_number: Mapped[str] = mapped_column(String, nullable=False)
    organization_name: Mapped[str] = mapped_column(String, nullable=False)
    description:  Mapped[str] = mapped_column(String, nullable=False)
    size: Mapped[str] = mapped_column(String, nullable=False)
    branch: Mapped[str] = mapped_column(String, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(length=1024), nullable=False)
    registered_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

# # class EmployeeProject(Base):
# #     __tablename__ = "employee_project"
# #     employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employee.id"), primary_key=True)
# #     project_id: Mapped[int] = mapped_column(Integer, ForeignKey("project.id"), primary_key=True)
# #     status: Mapped[str] = mapped_column(String, default = "Роль не назначена")

# EmployeeProject = Table(
#     'employee_project', 
#     metadata,
#     Column('employee_id', Integer, ForeignKey('employee.id')),
#     Column('project_id', Integer, ForeignKey('project.id')),
#     Column('status', String, default = "Роль не назначена"),
# )
# class Employee(Base):
#     __tablename__ = 'employee'
#     id: Mapped[int] = mapped_column(Integer, primary_key=True)
#     f_name: Mapped[str] = mapped_column(String, nullable=False)
#     s_name: Mapped[str] = mapped_column(String, nullable=False)
#     age:  Mapped[int] = mapped_column(Integer, nullable=False)
#     status: Mapped[str] = mapped_column(String, default="Не занят в проекте")
#     user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
#     project: Mapped[List["Employee"]] = relationship('Project', secondary=EmployeeProject, back_populates='employee', primaryjoin=id == EmployeeProject.c.project_id)

# class Project(Base):
#     __tablename__ = 'project'

#     id: Mapped[int] = mapped_column(Integer, primary_key=True)
#     name: Mapped[str] = mapped_column(String, nullable=False)
#     create_at:  Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow) #Дата создания ставится юзером
#     deadline:  Mapped[datetime] = mapped_column(TIMESTAMP, nullable=True)  #Дата дэдлайна ставится самостоятельно#Если дэдлайн пройден, то статус меняется на "просрочен"#Если проект не дошел до дэдлайна, то "в работе"                                                                                 #Если проект завершен, то ручками прописвается статус "завершен"
#     description:  Mapped[str] = mapped_column(String, nullable=False) 
#     budget:  Mapped[int] = mapped_column(Integer, nullable=False) #Создаю схему с этими полями
#     customer: Mapped[str] = mapped_column(String, nullable=False) 
#     team_leader:  Mapped[str] = mapped_column(String, nullable=False) #Один сотрудник может быть ответственным за многие проекты
#     status:  Mapped[str] = mapped_column(String, nullable=False) #???
#     user_id:  Mapped[int] = mapped_column(Integer, ForeignKey('user.id'), nullable=False) #Прописать связь через другой метод релэйшншип
#     employee: Mapped[List["Project"]]  = relationship('Employee', secondary=EmployeeProject, back_populates='project',  primaryjoin=id == EmployeeProject.c.employee_id)
#     #Возможность редактирования проекта не только при создании, но и в любой момент
class Task(Base):
    __tablename__ = 'task'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description:  Mapped[str] = mapped_column(String, nullable=False)
    deadline:  Mapped[date] = mapped_column(TIMESTAMP, nullable=True)
    status:  Mapped[str] = mapped_column(String, default="Актуально")
    user_id:  Mapped[int] = mapped_column(Integer, ForeignKey('user.id'), nullable=False)

class Customer(Base):
    __tablename__ = 'customer'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    organization_name: Mapped[str] = mapped_column(String, nullable=False)
    description:  Mapped[str] = mapped_column(String, nullable=False)
    size: Mapped[str] = mapped_column(String, nullable=False)
    branch: Mapped[str] = mapped_column(String, nullable=False)

class Contact_person(Base):                                           #они нормальные
    __tablename__ = 'contact_person'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    f_name: Mapped[str] = mapped_column(String, nullable=False)
    s_name: Mapped[str] = mapped_column(String, nullable=False)
    t_name: Mapped[str] = mapped_column(String, nullable=False)
    post: Mapped[str] = mapped_column(String, nullable=False)
    contact_number: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    customer_id:  Mapped[int] = mapped_column(Integer, ForeignKey('customer.id'), nullable=False)

class Project(Base):
    __tablename__ = 'project'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    create_at:  Mapped[date] = mapped_column(TIMESTAMP, nullable=True) #Дата создания ставится юзером
    deadline:  Mapped[date] = mapped_column(TIMESTAMP, nullable=True)  #Дата дэдлайна ставится самостоятельно#Если дэдлайн пройден, то статус меняется на "просрочен"#Если проект не дошел до дэдлайна, то "в работе"                                                                                 #Если проект завершен, то ручками прописвается статус "завершен"
    description:  Mapped[str] = mapped_column(String, nullable=False) 
    budget:  Mapped[int] = mapped_column(Integer, nullable=False) #Создаю схему с этими полями
    customer: Mapped[str] = mapped_column(String, nullable=False) 
    team_leader:  Mapped[str] = mapped_column(String, nullable=False) #Один сотрудник может быть ответственным за многие проекты
    status:  Mapped[str] = mapped_column(String, nullable=False) #???
    user_id:  Mapped[int] = mapped_column(Integer, ForeignKey('user.id'), nullable=False) #Прописать связь через другой метод релэйшншип#################################
    customer_id:  Mapped[int] = mapped_column(Integer, ForeignKey('customer.id'), nullable=False)    
    
                               #########Данную таблицу добавить в миграции#
    #Возможность редактирования проекта не только при создании, но и в любой момент                                          ############################################

class Employee(Base):
    __tablename__ = 'employee'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    f_name: Mapped[str] = mapped_column(String, nullable=False)
    s_name: Mapped[str] = mapped_column(String, nullable=False)
    t_name: Mapped[str] = mapped_column(String, nullable=False)
    birthday: Mapped[date] = mapped_column(TIMESTAMP, nullable=False)
    contact_number: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    description:  Mapped[str] = mapped_column(String, nullable=False)
    education_data: Mapped[str] = mapped_column(String, nullable=False)
    # age: Mapped[date] = mapped_column(TIMESTAMP, nullable=False) #удалить
    spec: Mapped[str] = mapped_column(String, nullable=False)
    # spec_level: Mapped[str] = mapped_column(String, nullable=False) #удалить
    status: Mapped[str] = mapped_column(String, default="Не занят в проекте")
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    # user: Mapped["User"] = relationship(back_populates = "employee") #Это не точно
    employee_project: Mapped["User"] = relationship("EmployeeProject", cascade="all, delete-orphan")

class EmployeeProject(Base):
    __tablename__ = "employee_project"
    employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employee.id"), primary_key=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("project.id"), primary_key=True)
    status: Mapped[str] = mapped_column(String, default = "Роль не назначена")

class HardSkill(Base):
    __tablename__ = 'hard_skill'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)

class SoftSkill(Base):
    __tablename__ = 'soft_skill'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False) #Должен передавать список скиллов в выпадающий список
    title: Mapped[str] = mapped_column(String, nullable=False)

class ProjectHardSkills(Base):
    __tablename__ = "project_required_hard_skill"
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("project.id"), primary_key=True)
    hard_skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("hard_skill.id"), primary_key=True)

class ProjectSoftSkills(Base):
    __tablename__ = "project_required_soft_skill"
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("project.id"), primary_key=True)
    soft_skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("soft_skill.id"), primary_key=True)

class EmployeeHardSkills(Base):
    __tablename__ = "employee_hard_skill"
    employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employee.id"), primary_key=True)
    hard_skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("hard_skill.id"), primary_key=True)

class EmployeeSoftSkills(Base):
    __tablename__ = "employee_soft_skill"
    employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employee.id"), primary_key=True)
    soft_skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("soft_skill.id"), primary_key=True)











# class User(SQLAlchemyBaseUserTable[int], Base):
#     __tablename__ = "user"
#     id: Mapped[int] = mapped_column(primary_key=True)
#     f_name: Mapped[str] = mapped_column(String, nullable=False)
#     s_name: Mapped[str] = mapped_column(String, nullable=False)
#     hashed_password: Mapped[str] = mapped_column(String(length=1024), nullable=False)
#     registered_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)
#     is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
#     is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
#     is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


# class Project(Base):
#     __tablename__ = 'project'

#     id: Mapped[int] = mapped_column(Integer, primary_key=True)
#     name: Mapped[str] = mapped_column(String, nullable=False)
#     create_at:  Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow) #Дата создания ставится юзером
#     deadline:  Mapped[datetime] = mapped_column(TIMESTAMP, nullable=True)  #Дата дэдлайна ставится самостоятельно#Если дэдлайн пройден, то статус меняется на "просрочен"#Если проект не дошел до дэдлайна, то "в работе"                                                                                 #Если проект завершен, то ручками прописвается статус "завершен"
#     description:  Mapped[str] = mapped_column(String, nullable=False) 
#     budget:  Mapped[int] = mapped_column(Integer, nullable=False) #Создаю схему с этими полями
#     customer: Mapped[str] = mapped_column(String, nullable=False) 
#     team_leader:  Mapped[str] = mapped_column(String, nullable=False) #Один сотрудник может быть ответственным за многие проекты
#     status:  Mapped[str] = mapped_column(String, nullable=False) #???
#     user_id:  Mapped[int] = mapped_column(Integer, ForeignKey('user.id'), nullable=False) #Прописать связь через другой метод релэйшншип
#     #Возможность редактирования проекта не только при создании, но и в любой момент

# class Employee(Base):
#     __tablename__ = 'employee'
#     id: Mapped[int] = mapped_column(Integer, primary_key=True)
#     f_name: Mapped[str] = mapped_column(String, nullable=False)
#     s_name: Mapped[str] = mapped_column(String, nullable=False)
#     age:  Mapped[int] = mapped_column(Integer, nullable=False)
#     status: Mapped[str] = mapped_column(String, default="Не занят в проекте")

#     user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
#     # user: Mapped["User"] = relationship(back_populates = "employee") #Это не точно
#     employee_project: Mapped["User"] = relationship("EmployeeProject", cascade="all, delete-orphan")

# class HardSkill(Base):
#     __tablename__ = 'hard_skill'
#     id: Mapped[int] = mapped_column(Integer, primary_key=True)
#     name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
#     title: Mapped[str] = mapped_column(String, nullable=False)

# class SoftSkill(Base):
#     __tablename__ = 'soft_skill'
#     id: Mapped[int] = mapped_column(Integer, primary_key=True)
#     name: Mapped[str] = mapped_column(String, unique=True, nullable=False) #Должен передавать список скиллов в выпадающий список
#     title: Mapped[str] = mapped_column(String, nullable=False)

# class EmployeeProject(Base):
#     __tablename__ = "employee_project"
#     employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employee.id"), primary_key=True)
#     project_id: Mapped[int] = mapped_column(Integer, ForeignKey("project.id"), primary_key=True)
#     status: Mapped[str] = mapped_column(String, default = "Роль не назначена")

# class ProjectHardSkills(Base):
#     __tablename__ = "project_required_hard_skill"
#     project_id: Mapped[int] = mapped_column(Integer, ForeignKey("project.id"), primary_key=True)
#     hard_skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("hard_skill.id"), primary_key=True)

# class ProjectSoftSkills(Base):
#     __tablename__ = "project_required_soft_skill"
#     project_id: Mapped[int] = mapped_column(Integer, ForeignKey("project.id"), primary_key=True)
#     soft_skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("soft_skill.id"), primary_key=True)

# class EmployeeHardSkills(Base):
#     __tablename__ = "employee_hard_skill"
#     employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employee.id"), primary_key=True)
#     hard_skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("hard_skill.id"), primary_key=True)

# class EmployeeSoftSkills(Base):
#     __tablename__ = "employee_soft_skill"
#     employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employee.id"), primary_key=True)
#     soft_skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("soft_skill.id"), primary_key=True)


















# class User(Base):
#     __tablename__= "users"
#     id = Column(Integer, primary_key = True, index = True)
#     email = Column(String, unique = True, index = True)
#     hashed_password = Column(String)
#     is_active = Column(Boolean, default=True)
#     items = relationship("Item", back_populates= "owner")

# class Item(Base):
#     __tablename__ = "items"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     description = Column(String, index=True)
#     owner_id = Column(Integer, ForeignKey("users.id"))
#     owner = relationship("User", back_populates="items") #Создания отношения один ко многим с последним столбцов предыдущей таблицы