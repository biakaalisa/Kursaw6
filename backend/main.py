from fastapi import FastAPI, Depends

from fastapi.responses import JSONResponse
from fastapi_users import FastAPIUsers, fastapi_users
from auth.database import User
from sqlalchemy.orm import Session
from auth.auth import auth_backend
from sqlalchemy import insert, select, delete
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from auth.database import get_async_session
from fastapi import APIRouter
from sqlalchemy.orm import joinedload
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from auth.manager import get_user_manager
from models.schemas import UserCreate, UserRead, TaskCreate, TaskRead, ProjectCreate, ProjectResponse, EmployeeResponse, CreateHardSkill, CustomerCreate, CustomerRead, ContactPersonCreate,ContactPersonRead, CreateSoftSkill, ResponseSoftSkill, ResponseHardSkill, CreateEmployee
from sqlalchemy import insert, select, delete, update, or_, func
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from auth.database import get_async_session
from fastapi import APIRouter
from models.model import User, Task, Project, HardSkill, SoftSkill, Customer, Contact_person, Employee, ProjectHardSkills, EmployeeProject, EmployeeSoftSkills, EmployeeHardSkills, ProjectSoftSkills
from fastapi_users import FastAPIUsers, fastapi_users
from sqlalchemy.orm import joinedload
from fastapi import HTTPException
from datetime import datetime, date
from time import time
from sqlalchemy import func
from sqlalchemy import Column

from typing import List

app = FastAPI(title = "Team_Builder")

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["Auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["Register"],
)

current_user = fastapi_users.current_user()

@app.post("/create_contact_person/")
async def create_contact_person(cp: ContactPersonCreate, session: AsyncSession = Depends(get_async_session)):
        cpc_query = await session.execute(select(Contact_person.email).where(Contact_person.email == cp.email))
        cpc = cpc_query.scalars().first()
        if not cpc:
            stmt = insert(Contact_person).values(**cp.dict())
            await session.execute(stmt)
            await session.commit()
            return {"message": "Добавление контактного лица прошло успешно"}
        else:
            raise HTTPException(status_code=200, detail="Данное контактное лицо уже является чьим-то контактным лицом")

@app.get("/get_contact_person_by_customer_id/", response_model = List[ContactPersonRead])
async def get_contact_person(cust_id: int, session: AsyncSession = Depends(get_async_session)):
    query = await session.execute(select(Contact_person).where(Contact_person.customer_id == cust_id))
    result = query.scalars().all()
    if result:
        response_contact_number = []
        for contact_person in result:
            response_contact_number.append(ContactPersonRead(f_name = contact_person.f_name, s_name = contact_person.s_name, t_name = contact_person.t_name, post = contact_person.post, contact_number = contact_person.contact_number,email = contact_person.email))
        return response_contact_number
    else:
        raise HTTPException(status_code=200, detail="У данного заказчика нет контактных лиц")

@app.get("/get_customer_by_id/", response_model = CustomerRead)
async def get_contact_person(cust_id: int, session: AsyncSession = Depends(get_async_session)):
    query = await session.execute(select(Customer).where(Customer.id == cust_id))
    result = query.scalars().first()
    res = CustomerRead(id = result.id, organization_name=result.organization_name, description=result.description, size = result.size, branch = result.branch)
    return res


@app.post("/create_customer/")
async def create_customer(cc: CustomerCreate, session: AsyncSession = Depends(get_async_session)):
    try:
        customer_query = await session.execute(select(Customer.organization_name).where(Customer.organization_name == cc.organization_name))
        customer = customer_query.scalars().first()
        stmt = insert(Customer).values(**cc.dict())
        await session.execute(stmt)
        await session.commit()
        return {"message": "Добавление заказчика прошло успешно"}
    except:
        raise HTTPException(status_code=400, detail="Ошибка при добавлении заказчика")
    
@app.get("/get_all_customer/", response_model = List[CustomerRead])#, response_model = List[ContactPersonRead]
async def get_all_customer(session: AsyncSession = Depends(get_async_session)):
    query = await session.execute(select(Customer))
    result = query.scalars().all()
    response_customer = []
    for cus in result:
        response_customer.append(CustomerRead(id = cus.id, organization_name=cus.organization_name, description=cus.description, size = cus.size, branch = cus.branch))
    return response_customer
# contact_person_query = select(Contact_person.f_name, Contact_person.s_name, Contact_person.t_name, Contact_person.post, Contact_person.contact_number, Contact_person.email ).where(Contact_person.customer_id == cus.id)
        # print((await session.execute(contact_person_query)).fetchall())
        # contact_person_result = (await session.execute(contact_person_query)).scalars().all()
        
        # customer_response = CustomerRead(
        #     id = cus.id,
        #     organization_name = cus.organization_name,
        #     description = cus.description,
        #     size= cus.size,
        #     branch = cus.branch, 
        #     contact_person = contact_person_result,   
        # )
        # response_customer.append(customer_response)
@app.post("/projects/")  #готовая api
async def create_project(project: ProjectCreate, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    project_data = project.dict()
    project_data["user_id"] = user.id
    project_data["status"] = "В работе"
    query = insert(Project).values(**project_data)
    await session.execute(query)
    await session.commit()
    return {"message": "Создание проекта прошло успешно"}

@app.post("/create_hard_skill/")
async def create_hard_skill(hs: CreateHardSkill, session: AsyncSession = Depends(get_async_session)):
    try:
        query = insert(HardSkill).values(**hs.dict())
        await session.execute(query)
        await session.commit()
        inserted_hard_skill = await session.execute(select(HardSkill).filter_by(name=hs.name))
        inserted_hard_skill = inserted_hard_skill.scalar()
        if not inserted_hard_skill:
            raise HTTPException(status_code=400, detail="Навык с таким именем уже существует")
        return {"message": "Создание навыка прошло успешно"}
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Навык с таким именем уже существует")

@app.post("/create_soft_skill/")
async def create_hard_skill(ss: CreateSoftSkill, session: AsyncSession = Depends(get_async_session)):
    try:
        query = insert(SoftSkill).values(**ss.dict())
        await session.execute(query)
        await session.commit()
        inserted_soft_skill = await session.execute(select(SoftSkill).filter_by(name=ss.name))
        inserted_soft_skill = inserted_soft_skill.scalar()
        if not inserted_soft_skill:
            raise HTTPException(status_code=500, detail="Ошибка при добавлении навыка")
        return {"message": "Создание навыка прошло успешно"}
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Навык с таким именем уже существует")
    
@app.get("/get_hard_skill/", response_model=List[ResponseHardSkill])
async def get_hard_skill(session: AsyncSession = Depends(get_async_session)):
    query = select(HardSkill)
    result = await session.execute(query)
    hard_skills = result.scalars().all()
    response_hskills = []
    for hard_skill in hard_skills:
        response_hskills.append(ResponseHardSkill(id = hard_skill.id, name=hard_skill.name, title=hard_skill.title))
    return response_hskills

@app.get("/get_soft_skill/", response_model=List[ResponseSoftSkill])
async def get_soft_skill(session: AsyncSession = Depends(get_async_session)):
    query = select(SoftSkill)
    result = await session.execute(query)
    soft_skill = result.scalars().all()
    response_sskills = []
    for soft_skill in soft_skill:
        response_sskills.append(ResponseSoftSkill(id = soft_skill.id, name=soft_skill.name, title=soft_skill.title))
    return response_sskills

@app.post("/create_employee/")
async def add_employee(employee: CreateEmployee,user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    employee_data = employee.dict()
    employee_data['user_id'] = user.id
    employee_data['status'] = 'Не занят в проекте'
    query = insert(Employee).values(**employee_data)
    await session.execute(query)
    await session.commit()
    return {"message": "Добавление сотрудника прошло успешно"}
        
@app.post("/add_employee_hard_skill/")
async def add_employee_hard_skill(employee_id: int,hardskill_id: int,user: User = Depends(current_user),session: AsyncSession = Depends(get_async_session)):
    employee_query = await session.execute(select(Employee.f_name, Employee.s_name).where(Employee.id == employee_id, Employee.user_id == user.id))
    employee = employee_query.first()
    if employee:
        print("сотрудник найден")
        skill_query = await session.execute(select(HardSkill.name).where(HardSkill.id == hardskill_id))
        skillll = skill_query.first()
        if skillll:
            print("скил найден")
            employee_hard_skill_query = await session.execute(select(EmployeeHardSkills).where(EmployeeHardSkills.employee_id == employee_id, EmployeeHardSkills.hard_skill_id == hardskill_id))
            employee_hard_skill = employee_hard_skill_query.scalar()
            if not employee_hard_skill:
                stmt = insert(EmployeeHardSkills).values(employee_id = employee_id, hard_skill_id = hardskill_id)
                await session.execute(stmt)
                await session.commit()
                return {"message": "Связь хард скила и сотрудника успешно добавлена"}
            else:
                raise HTTPException(status_code=200, detail="Связь хард скила и сотрудника уже была добавлена ранее")
        else:
            return {"message": "Хард скил не найден"}
    else:
        return {"message": "Сотрудник не найден"}
    

@app.post("/add_employee_soft_skill/")
async def add_employee_hard_skill(employee_id: int,softskill_id: int,user: User = Depends(current_user),session: AsyncSession = Depends(get_async_session)):
    employee_query = await session.execute(select(Employee.f_name, Employee.s_name).where(Employee.id == employee_id, Employee.user_id == user.id))
    employee = employee_query.first()
    if employee:
        print("сотрудник найден")
        skill_query = await session.execute(select(SoftSkill.name).where(SoftSkill.id == softskill_id))
        skillll = skill_query.first()
        if skillll:
            print("скилл найден")
            employee_soft_skill_query = await session.execute(select(EmployeeSoftSkills).where(EmployeeSoftSkills.employee_id == employee_id, EmployeeSoftSkills.soft_skill_id == softskill_id))
            employee_soft_skill = employee_soft_skill_query.scalar()
            if not employee_soft_skill:
                stmt = insert(EmployeeSoftSkills).values(employee_id = employee_id, soft_skill_id = softskill_id)
                await session.execute(stmt)
                await session.commit()
                return {"message": "Связь софт скила и сотрудника успешно добавлена"}
            else:
                raise HTTPException(status_code=200, detail="Связь софт скила и сотрудника уже была добавлена ранее")
        else:
            return {"message": "Софт скил не найден"}
    else:
        return {"message": "Сотрудник не найден"}

@app.post("/add_soft_skill_to_project/")
async def add_soft_skill_to_project(softskill_id: int,project_id: int,user: User = Depends(current_user),session: AsyncSession = Depends(get_async_session)):
    project_query = await session.execute(select(Project.name).where(Project.id == project_id, Project.user_id == user.id))
    project = project_query.first()
    if project:
        print("проект найден")
        skill_query = await session.execute(select(SoftSkill.name).where(SoftSkill.id == softskill_id))
        skillll = skill_query.first()
        if skillll:
            print("скилл найден")
            soft_skill_project_query = await session.execute(select(ProjectSoftSkills).where(ProjectSoftSkills.soft_skill_id == softskill_id, ProjectSoftSkills.project_id == project_id))
            soft_skill_project = soft_skill_project_query.scalar()
            if not soft_skill_project:
                stmt = insert(ProjectSoftSkills).values(project_id = project_id, soft_skill_id = softskill_id)
                await session.execute(stmt)
                await session.commit()
                return {"message": "Связь софт скила и проекта успешно добавлена"}
            else:
                raise HTTPException(status_code=200, detail="Связь софт скила и проекта уже была добавлена ранее")
        else:
            return {"message": "Софт скил не найден"}
    else:
        return {"message": "Проект не найден"}

@app.post("/add_hard_skill_to_project/")
async def add_hard_skill_to_project(hardskill_id: int,project_id: int,user: User = Depends(current_user),session: AsyncSession = Depends(get_async_session)):
    project_query = await session.execute(select(Project.name).where(Project.id == project_id, Project.user_id == user.id))
    project = project_query.first()
    if project:
        print("проект найден")
        skill_query = await session.execute(select(HardSkill.name).where(HardSkill.id == hardskill_id))
        skillll = skill_query.first()
        if skillll:
            print("скилл найден")
            hard_skill_project_query = await session.execute(select(ProjectHardSkills).where(ProjectHardSkills.hard_skill_id == hardskill_id, ProjectSoftSkills.project_id == project_id))
            hard_skill_project = hard_skill_project_query.scalar()
            if not hard_skill_project:
                stmt = insert(ProjectHardSkills).values(project_id = project_id, hard_skill_id = hardskill_id)
                await session.execute(stmt)
                await session.commit()
                return {"message": "Связь хард скила и проекта успешно добавлена"}
            else:
                raise HTTPException(status_code=200, detail="Связь хард скила и проекта уже была добавлена ранее")
        else:
            return {"message": "Хард скил не найден"}
    else:
        return {"message": "Проект не найден"}

@app.post("/add_employee_to_project/")
async def add_employee_to_project(employee_id: int,project_id: int, role: str, stavka: str, user: User = Depends(current_user),session: AsyncSession = Depends(get_async_session)):
    project_query = await session.execute(select(Project.name).where(Project.id == project_id, Project.user_id == user.id))
    project = project_query.first()
    if project:
        employee_query = await session.execute(select(Employee.f_name,).where(Employee.id == employee_id, Employee.user_id == user.id))
        employee = employee_query.first()
        if employee:
            employee_project_query = select(EmployeeProject).where(EmployeeProject.employee_id == employee_id, EmployeeProject.project_id == project_id)
            employee_project_result = await session.execute(employee_project_query)
            employee_project = employee_project_result.scalar()
            if employee_project:
                raise HTTPException(status_code=403, detail="Сотрудник уже был связан с проектом ранее")
            status_query = await session.execute(select(Employee.status).where(Employee.id == employee_id))
            stat = status_query.scalar()
            if stat == "Не занят в проекте":
                stmt = insert(EmployeeProject).values(employee_id = employee_id, project_id = project_id, status = role)
                await session.execute(stmt)
                await session.commit()
                if stavka == "На полную ставку":
                    stmt = update(Employee).where(Employee.id == employee_id, Employee.user_id == user.id).values(status = stavka)
                    await session.execute(stmt)
                    await session.commit()
                elif stavka == "На пол ставки":
                    stmt = update(Employee).where(Employee.id == employee_id, Employee.user_id == user.id).values(status = stavka)
                    await session.execute(stmt)
                    await session.commit()
                return {"message": "Сотрудник успешно добавлен на проект"}
            elif stat == "На пол ставки":
                stmt = insert(EmployeeProject).values(employee_id = employee_id, project_id = project_id, status = role)
                await session.execute(stmt)
                await session.commit()
                if stavka == "На полную ставку":
                    return {"message": "Невозможно добавить сотрудника на полную ставку, так как он уже занят на одном из проектов"}
                elif stavka == "На пол ставки":
                    stmt = update(Employee).where(Employee.id == employee_id, Employee.user_id == user.id).values(status = "На полную ставку")
                    await session.execute(stmt)
                    await session.commit()
                    return {"message": "Сотрудник успешно добавлен на проект"}
            elif stat == "На полную ставку":
                return {"message": "Невозможно добавить сотрудника, так как он уже занят на максимальном количестве проектов"}
        else:
            return {"message": "Сотрудник не найден"}
    else:
        return {"message": "Проект не найден"}
            

@app.post("/user_projects/", response_model=List[ProjectResponse])
async def get_user_projects(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
    # soft_skills_query = select(SoftSkill.name).join(EmployeeSoftSkills).where(EmployeeSoftSkills.employee_id == 1)
    # soft_skills_result = (await session.execute(soft_skills_query)).scalars().all()
    # listss = soft_skills_result
    # print(listss)    
    query = select(Project).where(Project.user_id == user.id)
    result = await session.execute(query)
    projects = result.scalars().all()
    

    if not projects:
        raise HTTPException(status_code=200, detail="У вас нет проектов")
    # for pr in projects:
    #     if pr.deadline < datetime.utcnow():
    #         qr = update(Project).where(Project.user_id == user.id, pr.deadline < datetime.utcnow()).values(status = "В работе")
    #         await session.execute(qr)
    #         await session.commit()

    
    qr = update(Project).where(Project.user_id == user.id, Project.deadline < datetime.utcnow()).values(status = "Просрочен")
    await session.execute(qr)
    qrr = update(Project).where(Project.user_id == user.id, Project.deadline > datetime.utcnow()).values(status = "В работе")
    await session.execute(qrr)
    await session.commit()
    project_list = []
    for project in projects:
        soft_skills_query = select(SoftSkill.name).join(ProjectSoftSkills).where(ProjectSoftSkills.project_id == project.id)
        soft_skills_result = (await session.execute(soft_skills_query)).scalars().all()
        hard_skills_query = select(HardSkill.name).join(ProjectHardSkills).where(ProjectHardSkills.project_id == project.id)
        hard_skills_result = (await session.execute(hard_skills_query)).scalars().all()
        project_response = ProjectResponse(
            id = project.id,
            name=project.name,  
            description=project.description,  
            create_at = project.create_at,
            deadline = project.deadline,
            budget=project.budget,  
            customer=project.customer,
            team_leader = project.team_leader,  
            status=project.status,
            hard_skill= hard_skills_result,
            soft_skill= soft_skills_result,
        )
        project_list.append(project_response)
    return project_list
        
        
@app.get("/user_employees/", response_model=List[EmployeeResponse])
async def get_user_projects(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
    # soft_skills_query = select(SoftSkill.name).join(EmployeeSoftSkills).where(EmployeeSoftSkills.employee_id == 1)
    # soft_skills_result = (await session.execute(soft_skills_query)).scalars().all()
    # listss = soft_skills_result
    # print(listss)    
    query = select(Employee).where(Employee.user_id == user.id)
    result = await session.execute(query)
    employees = result.scalars().all()

    if not employees:
        raise HTTPException(status_code=200, detail="У вас нет сотрудников")
    
    employee_list = []
    for employee in employees:
        soft_skills_query = select(SoftSkill.name).join(EmployeeSoftSkills).where(EmployeeSoftSkills.employee_id == employee.id)
        soft_skills_result = (await session.execute(soft_skills_query)).scalars().all()
        hard_skills_query = select(HardSkill.name).join(EmployeeHardSkills).where(EmployeeHardSkills.employee_id == employee.id)
        hard_skills_result = (await session.execute(hard_skills_query)).scalars().all()
        employee_response = EmployeeResponse(
            id = employee.id,
            f_name=employee.f_name,  
            s_name=employee.s_name,
            t_name=employee.t_name,
            birthday=employee.birthday,
            contact_number=employee.contact_number,
            email=employee.email,
            description=employee.description,
            education_data=employee.education_data,
            spec = employee.spec,
            status=employee.status,
            hard_skill= hard_skills_result,
            soft_skill= soft_skills_result,
        )
        employee_list.append(employee_response)
    return employee_list
    
@app.delete("/employee/")
async def delete_employee(employee_id: int,user: User = Depends(current_user),session: AsyncSession = Depends(get_async_session)):
    query = select(Employee).where(Employee.id == employee_id, Employee.user_id == user.id)
    result = await session.execute(query)
    employee = result.scalar()
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    q = delete(EmployeeProject).where(EmployeeProject.employee_id == employee_id)
    await session.execute(q)
    qq = delete(EmployeeHardSkills).where(EmployeeHardSkills.employee_id == employee_id)
    await session.execute(qq)
    qqq = delete(EmployeeSoftSkills).where(EmployeeSoftSkills.employee_id == employee_id)
    await session.execute(qqq)
    query = delete(Employee).where(Employee.id == employee_id)
    await session.execute(query)
    await session.commit()
    return {"message": "Сотрудник успешно удален"}

@app.delete("/project/")
async def delete_project(project_id: int,user: User = Depends(current_user),session: AsyncSession = Depends(get_async_session)):
    project_query = select(Project).where(Project.id == project_id, Project.user_id == user.id)
    project_result = await session.execute(project_query)
    project = project_result.scalar()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
    q = delete(ProjectHardSkills).where(ProjectHardSkills.project_id == project_id)
    await session.execute(q)
    qq = delete(ProjectSoftSkills).where(ProjectSoftSkills.project_id == project_id)
    await session.execute(qq)
    query = delete(Project).where(Project.id == project_id)
    await session.execute(query)
    await session.commit()
    return {"message": "Проект успешно удален"}


@app.delete("/remove_employee_hard_skill/")
async def remove_employee_hard_skill(employee_id: int,hard_skill_id: int,user: User = Depends(current_user),session: AsyncSession = Depends(get_async_session)):
    try:
        employee_query = await session.execute(select(Employee).where(Employee.id == employee_id, Employee.user_id == user.id))
        employee = employee_query.scalar()
        if not employee:
            raise HTTPException(status_code=403, detail="Сотрудник Вам не принадлежит")
        employee = await session.get(Employee, employee_id)
        hard_skill = await session.get(HardSkill, hard_skill_id)
        if not employee:
            raise HTTPException(status_code=404, detail="Сотрудник не найден")
        if not hard_skill:
            raise HTTPException(status_code=404, detail="Хард скил не найден")
        employee_hard_skill_query = await session.execute(select(EmployeeHardSkills).where(EmployeeHardSkills.employee_id == employee_id, EmployeeHardSkills.hard_skill_id == hard_skill_id))
        employee_hard_skill = employee_hard_skill_query.scalar()
        if not employee_hard_skill:
            raise HTTPException(status_code=404, detail="Связь хард скила и сотрудника не найдена")
        await session.execute(delete(EmployeeHardSkills).where(EmployeeHardSkills.employee_id == employee_id,EmployeeHardSkills.hard_skill_id == hard_skill_id))
        await session.commit()
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении связи хард скила и сотрудника: {str(e)}")
    return {"message": "Связь хард скила и сотрудника успешно удалена"}

@app.delete("/remove_employee_soft_skill/")
async def remove_employee_soft_skill(employee_id: int, soft_skill_id: int,user: User = Depends(current_user),session: AsyncSession = Depends(get_async_session)):
    try:
        employee_query = await session.execute(select(Employee).where(Employee.id == employee_id, Employee.user_id == user.id))
        employee = employee_query.scalar()
        if not employee:
            raise HTTPException(status_code=403, detail="Сотрудник Вам не принадлежит")
        employee = await session.get(Employee, employee_id)
        soft_skill = await session.get(SoftSkill, soft_skill_id)
        if not employee:
            raise HTTPException(status_code=404, detail="Сотрудник не найден")
        if not soft_skill:
            raise HTTPException(status_code=404, detail="Софт скил не найден")
        employee_soft_skill_query = await session.execute(select(EmployeeSoftSkills).where(EmployeeSoftSkills.employee_id == employee_id, EmployeeSoftSkills.soft_skill_id == soft_skill_id))
        employee_soft_skill = employee_soft_skill_query.scalar()
        if not employee_soft_skill:
            raise HTTPException(status_code=404, detail="Связь софт скила и сотрудника не найдена")
        await session.execute(delete(EmployeeSoftSkills).where(EmployeeSoftSkills.employee_id == employee_id,EmployeeSoftSkills.soft_skill_id == soft_skill_id))
        await session.commit()
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении связи софт скила и сотрудника: {str(e)}")
    return {"message": "Связь софт скила и сотрудника успешно удалена"}


@app.delete("/remove_soft_skill_from_project/")
async def remove_soft_skill_from_project(soft_skill_id: int, project_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    try:
        project_query = await session.execute(select(Project).where(Project.id == project_id, Project.user_id == user.id))
        project = project_query.scalar()
        if not project:
            raise HTTPException(status_code=403, detail="Проект не принадлежит пользователю")
        soft_skill = await session.get(SoftSkill, soft_skill_id)
        if not soft_skill:
            raise HTTPException(status_code=404, detail="Софт скил не найден")
        soft_skill_project_query = await session.execute(select(ProjectSoftSkills).where(ProjectSoftSkills.soft_skill_id == soft_skill_id, ProjectSoftSkills.project_id == project_id))
        soft_skill_project = soft_skill_project_query.scalar()
        if not soft_skill_project:
            raise HTTPException(status_code=404, detail="Связь софт скила и проекта не найдена")
        await session.execute(delete(ProjectSoftSkills).where(ProjectSoftSkills.project_id == project_id, ProjectSoftSkills.soft_skill_id == soft_skill_id))
        await session.commit()
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении связи софт скила и проекта: {str(e)}")
    return {"message": "Связь софт скила и проекта успешно удалена"}

@app.delete("/remove_hard_skill_from_project/")
async def remove_hard_skill_from_project(hard_skill_id: int, project_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    try:
        project_query = await session.execute(select(Project).where(Project.id == project_id, Project.user_id == user.id))
        project = project_query.scalar()
        if not project:
            raise HTTPException(status_code=403, detail="Проект не принадлежит пользователю")
        hard_skill = await session.get(HardSkill, hard_skill_id)
        if not hard_skill:
            raise HTTPException(status_code=404, detail="Хард скил не найден")
        hard_skill_project_query = await session.execute(select(ProjectHardSkills).where(ProjectHardSkills.hard_skill_id == hard_skill_id, ProjectSoftSkills.project_id == project_id))
        hard_skill_project = hard_skill_project_query.scalar()
        if not hard_skill_project:
            raise HTTPException(status_code=404, detail="Связь хард скила и проекта не найдена")
        await session.execute(delete(ProjectHardSkills).where(ProjectHardSkills.project_id == project_id, ProjectHardSkills.hard_skill_id == hard_skill_id))
        await session.commit()
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении связи хард скила и проекта: {str(e)}")
    return {"message": "Связь хард скила и проекта успешно удалена"}

# @app.delete("/remove_hard_skill_from_project/")
# async def remove_hard_skill_from_project(hard_skill_id: int, project_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     try:
#         project_query = await session.execute(select(Project).where(Project.id == project_id, Project.user_id == user.id))
#         project = project_query.scalar()
#         if not project:
#             raise HTTPException(status_code=403, detail="Проект не принадлежит пользователю")
#         hard_skill = await session.get(HardSkill, hard_skill_id)
#         if not hard_skill:
#             raise HTTPException(status_code=404, detail="Хард скил не найден")
#         hard_skill_project_query = await session.execute(select(ProjectHardSkills).where(ProjectHardSkills.hard_skill_id == hard_skill_id, ProjectSoftSkills.project_id == project_id))
#         hard_skill_project = hard_skill_project_query.scalar()
#         if not hard_skill_project:
#             raise HTTPException(status_code=404, detail="Связь хард скила и проекта не найдена")
#         await session.execute(delete(ProjectHardSkills).where(ProjectHardSkills.project_id == project_id, ProjectHardSkills.hard_skill_id == hard_skill_id))
#         await session.commit()
#     except HTTPException:
#         raise
#     except Exception as e:
#         await session.rollback()
#         raise HTTPException(status_code=500, detail=f"Ошибка при удалении связи хард скила и проекта: {str(e)}")
#     return {"message": "Связь хард скила и проекта успешно удалена"}

@app.delete("/employee/{employee_id}/project/{project_id}")
async def remove_employee_from_project(employee_id: int, project_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    que = await session.execute(select(EmployeeProject.employee_id).where(EmployeeProject.employee_id == employee_id))
    coun = que.scalars().all()
    count = 0
    for i in coun:
        count += 1
    print(count)
    try:
        employee_query = select(Employee).where(Employee.id == employee_id, Employee.user_id == user.id)
        result = await session.execute(employee_query)
        employee = result.scalar()
        if not employee:
            raise HTTPException(status_code=403, detail="Сотрудник не принадлежит пользователю")
        qe = select(Employee).where(Employee.id == employee_id)
        qq = await session.execute(qe)
        q1 = qq.scalar()
        employee_project_query = select(EmployeeProject).where(EmployeeProject.employee_id == employee_id, EmployeeProject.project_id == project_id)
        employee_project_result = await session.execute(employee_project_query)
        employee_project = employee_project_result.scalar()
        if not employee_project:
            raise HTTPException(status_code=404, detail="Сотрудник не связан с проектом")
        current_status = employee_project.status
        query = delete(EmployeeProject).where(EmployeeProject.employee_id == employee_id, EmployeeProject.project_id == project_id)
        result = await session.execute(query)
        await session.commit()
        if count == 1:
            if q1.status == 'На пол ставки':
                await session.execute(update(Employee).where(Employee.id == employee_id).values(status="Не занят в проекте"))
            else:
                await session.execute(update(Employee).where(Employee.id == employee_id).values(status="Не занят в проекте"))
        else:
            if q1.status == 'На полную ставку':
                await session.execute(update(Employee).where(Employee.id == employee_id).values(status="На пол ставки"))
        await session.commit()
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении связи сотрудника с проектом: {str(e)}")
    return {"message": "Связь сотрудника с проектом успешно удалена"}





@app.get("/counter_projects/")
async def counter_projects(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):   
    query = select(Project).where(Project.user_id == user.id)
    result = await session.execute(query)
    projects = result.scalars().all()
    if not projects:
        raise HTTPException(status_code=200, detail="У вас нет проектов")
    counter = 0
    query = select(Project.name).where(Project.user_id == user.id)
    result = (await session.execute(query)).scalars().all()
    for i in result:
        counter+=1
    return counter

@app.get("/counter_active_projects/")
async def counter_active_projects(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):   
    query = select(Project).where(Project.user_id == user.id)
    result = await session.execute(query)
    projects = result.scalars().all()
    if not projects:
        raise HTTPException(status_code=200, detail="У вас нет проектов")
    counter = 0
    query = select(Project.name).where(Project.user_id == user.id, Project.status == "В работе")
    result = (await session.execute(query)).scalars().all()
    for i in result:
        counter+=1
    return counter

@app.get("/counter_employees/")
async def counter_employees(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):   
    query = select(Employee).where(Employee.user_id == user.id)
    result = await session.execute(query)
    employees = result.scalars().all()
    if not employees:
        raise HTTPException(status_code=200, detail="У вас нет сотрудников")
    counter = 0
    query = select(Employee.f_name).where(Employee.user_id == user.id)
    result = (await session.execute(query)).scalars().all()
    for i in result:
        counter+=1
    return counter

@app.get("/counter_free_employees/")
async def counter_free_employees(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):   
    query = select(Employee).where(Employee.user_id == user.id)
    result = await session.execute(query)
    employees = result.scalars().all()
    if not employees:
        raise HTTPException(status_code=200, detail="У вас нет сотрудников")
    counter = 0
    query = select(Employee.f_name).where(Employee.user_id == user.id, or_(Employee.status == "На пол ставки", Employee.status == "Не занят в проекте"))
    result = (await session.execute(query)).scalars().all()
    for i in result:
        counter+=1
    return counter

@app.get("/employee_on_project/")
async def employee_on_project(project_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    query = select(Employee.f_name, Employee.s_name, EmployeeProject.status).join(EmployeeProject).where(EmployeeProject.project_id == project_id)
    result = (await session.execute(query)).mappings().all()
    return result

@app.get("/project_on_employee/")
async def project_on_employee(employee_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    query = select(Project.name, Project.description).join(EmployeeProject).where(EmployeeProject.employee_id == employee_id)
    result = (await session.execute(query)).mappings().all()
    return result

@app.post("/project_head/")
async def project_head(head: str, project_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    query = update(Project).where(Project.id == project_id, Project.user_id == user.id).values(team_leader = head)
    await session.execute(query)
    await session.commit()
    return {"message": "Добавление ответственного за проект прошло успешно"}

@app.post("/change_project_deadline/")
async def change_project_deadline(dead: date, project_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    query = update(Project).where(Project.id == project_id, Project.user_id == user.id).values(deadline = dead)
    await session.execute(query)
    await session.commit()
    return {"message": "Изменение дэдлайна проекта прошло успешно"}


@app.post("/tasks/")  
async def create_tasks(task: TaskCreate, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    task_data = task.dict()
    task_data["user_id"] = user.id
    query = insert(Task).values(**task_data)
    result = await session.execute(query)
    await session.commit()
    return result

@app.post("/user_tasks/", response_model=List[TaskRead])  
async def read_tasks(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):  
    query = select(Task).where(Task.user_id == user.id)
    result = await session.execute(query)
    tasks = result.scalars().all()

    if not tasks:
        raise HTTPException(status_code=200, detail="У вас нет задач")
    
    qr = update(Task).where(Task.user_id == user.id, Task.deadline < datetime.utcnow()).values(status = "Просрочено")
    await session.execute(qr)
    qrr = update(Task).where(Task.user_id == user.id, Task.deadline > datetime.utcnow()).values(status = "Актуально")
    await session.execute(qrr)
    await session.commit()

    task_list = []
    for task in tasks:
        task_response = TaskRead(
            id = task.id,
            name=task.name,  
            description=task.description,  
            deadline = task.deadline, 
            status=task.status,
        )
        task_list.append(task_response)
    return task_list

@app.delete("/delete_task/")
async def delete_task(task_id: int,user: User = Depends(current_user),session: AsyncSession = Depends(get_async_session)):
    task_query = select(Task).where(Task.id == task_id, Task.user_id == user.id)
    task_result = await session.execute(task_query)
    task = task_result.scalar()
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    query = delete(Task).where(Task.id == task_id)
    await session.execute(query)
    await session.commit()
    return {"message": "Задача успешно удалена"}

@app.post("/change_task_name/")
async def change_task_name(name: str, task_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    query = update(Task).where(Task.id == task_id, Task.user_id == user.id).values(name = name)
    await session.execute(query)
    await session.commit()
    return {"message": "Изменение названия задачи прошло успешно"}
@app.post("/change_task_description/")
async def change_task_description(desc: str, task_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    query = update(Task).where(Task.id == task_id, Task.user_id == user.id).values(description = desc)
    await session.execute(query)
    await session.commit()
    return {"message": "Изменение описания задачи прошло успешно"}
@app.post("/change_task_deadline/")
async def change_task_deadline(dead: date, task_id: int, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    query = update(Task).where(Task.id == task_id, Task.user_id == user.id).values(deadline = dead)
    await session.execute(query)
    await session.commit()
    return {"message": "Изменение дэдлайна задачи прошло успешно"}

@app.put("/free_employee_put")
async def counter_free_put(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):   
    query = select(Employee).where(Employee.user_id == user.id)
    result = await session.execute(query)
    employees = result.scalars().all()
    if not employees:
        raise HTTPException(status_code=200, detail="У вас нет сотрудников")
    counter = 0
    query = select(Employee.f_name).where(Employee.user_id == user.id, or_(Employee.status == "На пол ставки", Employee.status == "Не занят в проекте"))
    result = (await session.execute(query)).scalars().all()
    for i in result:
        counter+=1
    return counter

@app.options("/valid_requests")
async def valid_requests():
    return HTTPException(status_code=200, headers= "DELETE, PUT, POST, GET, OPTIONS" )
    


























































































































# @app.post("/Start")
# async def Start(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#     for i in time_reg:
#         time_reg_1 = i
#     if(time_reg_1 == 0):                                                                            # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#         stmt = update(User).where(User.id == user.id).values(registered_at_sec = 1702841307.062066) # !!!!!сюда записать время ЗА день до начала мероприятия!!!!!
#         await session.execute(stmt)                                                                 # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#         await session.commit()

# @app.post("/First_Task")
# async def Check1(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):    

#     task_list = []
#     ts = (await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))).first()
#     for i in ts:
#         task_list.append(i)

#     if ch.answer.lower() == "1" and task_list[0] != True:
#         statement = update(User).where(User.id == user.id).values(first_task = True) #меняем номер
#         await session.execute(statement)
#         await session.commit()

#         task_list = []
#         ts = (await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))).first()
#         for i in ts:
#             task_list.append(i)

#         if task_list[0] == True: #меняем номер
#             stmt = update(User).where(User.id == user.id).values(time_result_sec = time())
#             await session.execute(stmt)
#             await session.commit()
#             time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#             for i in time_reg:
#                 time_reg_1 = i
#             time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#             for i in time_res:
#                 time_res_1 = i
#             section = time_res_1 - time_reg_1
#             stmttime = update(User).where(User.id == user.id).values(result_section = round(section, 1))
#             await session.execute(stmttime)
#             await session.commit()
#             score = (await session.execute(select(User.score).where(User.id == user.id))).first()
#             for i in score:
#                 score_znach = i
#             score_znach += 10 - round(section, 1)/200000
#             stmtscore = update(User).where(User.id == user.id).values(score = round(score_znach, 2))
#             await session.execute(stmtscore)
#             await session.commit()
#         return {"status1": "Верный пароль!!!"}
#     elif ch.answer.lower() != "1":
#         return {"status1": "Неверный пароль!!!"}
#     else:
#         return {"status1": "Верный пароль уже был введен ранее!!!"}
     
# @app.post("/Second_task")
# async def Check2(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     task_list = []
#     ts = (await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))).first()
#     for i in ts:
#         task_list.append(i)

#     if ch.answer.lower() == "2" and task_list[1] != True:
#         statement = update(User).where(User.id == user.id).values(second_task = True) #меняем номер
#         await session.execute(statement)
#         await session.commit()

#         task_list = []
#         ts = (await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))).first()
#         for i in ts:
#             task_list.append(i)

#         if task_list[1] == True: #меняем номер
#             stmt = update(User).where(User.id == user.id).values(time_result_sec = time())
#             await session.execute(stmt)
#             await session.commit()
#             time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#             for i in time_reg:
#                 time_reg_1 = i
#             time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#             for i in time_res:
#                 time_res_1 = i
#             section = time_res_1 - time_reg_1
#             stmttime = update(User).where(User.id == user.id).values(result_section = round(section, 1))
#             await session.execute(stmttime)
#             await session.commit()
#             score = (await session.execute(select(User.score).where(User.id == user.id))).first()
#             for i in score:
#                 score_znach = i
#             score_znach += 10 - round(section, 1)/200000
#             stmtscore = update(User).where(User.id == user.id).values(score = round(score_znach, 2))
#             await session.execute(stmtscore)
#             await session.commit()
#         return {"status2": "Верный пароль!!!"}
#     elif ch.answer.lower() != "2":
#         return {"status2": "Неверный пароль!!!"}
#     else:
#         return {"status2": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Third_task")
# async def Check3(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     task_list = []
#     ts = (await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))).first()
#     for i in ts:
#         task_list.append(i)

#     if ch.answer.lower() == "3" and task_list[2] != True:
#         statement = update(User).where(User.id == user.id).values(third_task = True) #меняем номер
#         await session.execute(statement)
#         await session.commit()

#         task_list = []
#         ts = (await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))).first()
#         for i in ts:
#             task_list.append(i)

#         if task_list[2] == True: #меняем номер
#             stmt = update(User).where(User.id == user.id).values(time_result_sec = time())
#             await session.execute(stmt)
#             await session.commit()
#             time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#             for i in time_reg:
#                 time_reg_1 = i
#             time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#             for i in time_res:
#                 time_res_1 = i
#             section = time_res_1 - time_reg_1
#             stmttime = update(User).where(User.id == user.id).values(result_section = round(section, 1))
#             await session.execute(stmttime)
#             await session.commit()
#             score = (await session.execute(select(User.score).where(User.id == user.id))).first()
#             for i in score:
#                 score_znach = i
#             score_znach += 10 - round(section, 1)/200000
#             stmtscore = update(User).where(User.id == user.id).values(score = round(score_znach, 2))
#             await session.execute(stmtscore)
#             await session.commit()
#         return {"status3": "Верный пароль!!!"}
#     elif ch.answer.lower() != "3":
#         return {"status3": "Неверный пароль!!!"}
#     else:
#         return {"status3": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Fourth_task")
# async def Check4(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     task_list = []
#     ts = (await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))).first()
#     for i in ts:
#         task_list.append(i)

#     if ch.answer.lower() == "4" and task_list[3] != True:
#         statement = update(User).where(User.id == user.id).values(fourth_task = True) #меняем номер
#         await session.execute(statement)
#         await session.commit()

#         task_list = []
#         ts = (await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))).first()
#         for i in ts:
#             task_list.append(i)

#         if task_list[3] == True: #меняем номер
#             stmt = update(User).where(User.id == user.id).values(time_result_sec = time())
#             await session.execute(stmt)
#             await session.commit()
#             time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#             for i in time_reg:
#                 time_reg_1 = i
#             time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#             for i in time_res:
#                 time_res_1 = i
#             section = time_res_1 - time_reg_1
#             stmttime = update(User).where(User.id == user.id).values(result_section = round(section, 1))
#             await session.execute(stmttime)
#             await session.commit()
#             score = (await session.execute(select(User.score).where(User.id == user.id))).first()
#             for i in score:
#                 score_znach = i
#             score_znach += 10 - round(section, 1)/200000
#             stmtscore = update(User).where(User.id == user.id).values(score = round(score_znach, 2))
#             await session.execute(stmtscore)
#             await session.commit()
#         return {"status4": "Верный пароль!!!"}
#     elif ch.answer.lower() != "4":
#         return {"status4": "Неверный пароль!!!"}
#     else:
#         return {"status4": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Fifth_task")
# async def Check5(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):

#     task_list = []
#     ts = (await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))).first()
#     for i in ts:
#         task_list.append(i)

#     if ch.answer.lower() == "5" and task_list[4] != True:
#         statement = update(User).where(User.id == user.id).values(fifth_task = True) #меняем номер
#         await session.execute(statement)
#         await session.commit()

#         task_list = []
#         ts = (await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))).first()
#         for i in ts:
#             task_list.append(i)

#         if task_list[4] == True: #меняем номер
#             stmt = update(User).where(User.id == user.id).values(time_result_sec = time())
#             await session.execute(stmt)
#             await session.commit()
#             time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#             for i in time_reg:
#                 time_reg_1 = i
#             time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#             for i in time_res:
#                 time_res_1 = i
#             section = time_res_1 - time_reg_1
#             stmttime = update(User).where(User.id == user.id).values(result_section = round(section, 1))
#             await session.execute(stmttime)
#             await session.commit()
#             score = (await session.execute(select(User.score).where(User.id == user.id))).first()
#             for i in score:
#                 score_znach = i
#             score_znach += 10 - round(section, 1)/200000
#             stmtscore = update(User).where(User.id == user.id).values(score = round(score_znach, 2))
#             await session.execute(stmtscore)
#             await session.commit()
#         return {"status5": "Верный пароль!!!"}
#     elif ch.answer.lower() != "5":
#         return {"status5": "Неверный пароль!!!"}
#     else:
#         return {"status5": "Верный пароль уже был введен ранее!!!"}
    
# @app.get("/Top_Lenta")
# async def Top_Lenta(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     up = (await session.execute(select(User.id))).all()
#     max = 0
#     for i in up:
#         for item in i:
#             if item > max:
#                 max = item
#     low_limit = 1
#     up_limit = max+1
#     query = select(User.username, User.email, User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task, User.score).where(User.id < up_limit, User.id >= low_limit).order_by(User.score.desc())
#     task = await session.execute(query)
#     return task.mappings().fetchmany(10)

# @app.get("/Task_Check", response_model=TaskCheck)
# async def Task_Check(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     query = await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))
#     return query.first()

# @app.get("/User_Info", response_model=UserInfo)
# async def User_Info(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     query = await session.execute(select(User.username, User.schoolname, User.email).where(User.id == user.id))
#     return query.first()


#1702505575.197161
#1702504935.9963443







# 1 место: лучший по времени
# 2 место: второй лучший по времени
# 3 место: третий лучший по времени
# 4 место: четвертый лучший по времени
# 5 место: третий с конца
# 6 место: второй с конца
# 7 место: первый с конца



































































































































# from fastapi import FastAPI, Depends
# from fastapi_users import FastAPIUsers, fastapi_users
# from auth.database import User
# from sqlalchemy.orm import Session
# from auth.auth import auth_backend
# from auth.manager import get_user_manager
# from models.schemas import UserCreate, UserRead
# # from routers.ScoreCheck import router as Score
# from sqlalchemy import insert, select, delete, update
# from fastapi import APIRouter, Depends
# from sqlalchemy.ext.asyncio import AsyncSession
# from auth.database import get_async_session
# from fastapi import APIRouter
# from models.model import User
# from fastapi_users import FastAPIUsers, fastapi_users
# from models.schemas import ScoreCheck, TaskCheck, UserInfo
# from sqlalchemy.orm import joinedload
# from fastapi import HTTPException
# from datetime import datetime
# from time import time
# from sqlalchemy import func
# from sqlalchemy import Column

# app = FastAPI(title = "Cyber-care")

# fastapi_users = FastAPIUsers[User, int](
#     get_user_manager,
#     [auth_backend],
# )

# app.include_router(
#     fastapi_users.get_auth_router(auth_backend),
#     prefix="/auth/jwt",
#     tags=["Auth"],
# )

# app.include_router(
#     fastapi_users.get_register_router(UserRead, UserCreate),
#     prefix="/auth",
#     tags=["Register"],
# )

# current_user = fastapi_users.current_user()

# @app.post("/First_Task")
# async def Check1(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):

#     fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#     for i in fr:
#         if(i == True):
#             frB = True
#         else:
#             frB = False    

#     if ch.answer.lower() == "целостность" and frB != True:
#         statement = update(User).where(User.id == user.id).values(first_task = True)
#         await session.execute(statement)
#         await session.commit()
#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False 
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False 
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False    
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow(), time_result_sec = time())
#             await session.execute(stmt)
#             await session.commit()
#             time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#             for i in time_reg:
#                 time_reg_1 = i
#             time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#             for i in time_res:
#                 time_res_1 = i
#             section = time_res_1 - time_reg_1
#             stmtend = update(User).where(User.id == user.id).values(result_section = section)
#             await session.execute(stmtend)
#             await session.commit()
#         return {"status1": "Верный пароль!!!"}
#     elif ch.answer.lower() != "целостность":
#         return {"status1": "Неверный пароль!!!"}
#     else:
#         return {"status1": "Верный пароль уже был введен ранее!!!"}
    
# @app.post("/Second_task")
# async def Check2(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#     for i in se:
#         if(i == True):
#             seB = True
#         else:
#             seB = False

#     if ch.answer.lower() == "защищенность" and seB != True:
#         statement = update(User).where(User.id == user.id).values(second_task = True)
#         await session.execute(statement)
#         await session.commit()

#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False  
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False 
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False    
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow(), time_result_sec = time())
#             await session.execute(stmt)
#             await session.commit()
#             time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#             for i in time_reg:
#                 time_reg_1 = i
#             time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#             for i in time_res:
#                 time_res_1 = i
#             section = time_res_1 - time_reg_1
#             stmtend = update(User).where(User.id == user.id).values(result_section = section)
#             await session.execute(stmtend)
#             await session.commit()
#         return {"status2": "Верный пароль!!!"}
#     elif ch.answer.lower() != "защищенность":
#         return {"status2": "Неверный пароль!!!"}
#     else:
#         return {"status2": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Third_task")
# async def Check3(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#     for i in th:
#         if(i == True):
#             thB = True
#         else:
#             thB = False 

#     if ch.answer.lower() == "доступность" and thB != True:
#         statement = update(User).where(User.id == user.id).values(third_task = True)
#         await session.execute(statement)
#         await session.commit()

#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False 
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False  
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False    
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow(), time_result_sec = time())
#             await session.execute(stmt)
#             await session.commit()
#             time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#             for i in time_reg:
#                 time_reg_1 = i
#             time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#             for i in time_res:
#                 time_res_1 = i
#             section = time_res_1 - time_reg_1
#             stmtend = update(User).where(User.id == user.id).values(result_section = section)
#             await session.execute(stmtend)
#             await session.commit()
#         return {"status3": "Верный пароль!!!"}
#     elif ch.answer.lower() != "доступность":
#         return {"status3": "Неверный пароль!!!"}
#     else:
#         return {"status3": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Fourth_task")
# async def Check4(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#     for i in fo:
#         if(i == True):
#             foB = True
#         else:
#             foB = False

#     if ch.answer.lower() == "конфиденциальность" and foB != True:
#         statement = update(User).where(User.id == user.id).values(fourth_task = True)
#         await session.execute(statement)
#         await session.commit()
#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False 
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False 
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False     
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow(), time_result_sec = time())
#             await session.execute(stmt)
#             await session.commit()
#             time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#             for i in time_reg:
#                 time_reg_1 = i
#             time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#             for i in time_res:
#                 time_res_1 = i
#             section = time_res_1 - time_reg_1
#             stmtend = update(User).where(User.id == user.id).values(result_section = section)
#             await session.execute(stmtend)
#             await session.commit()
#         return {"status4": "Верный пароль!!!"}
#     elif ch.answer.lower() != "конфиденциальность":
#         return {"status4": "Неверный пароль!!!"}
#     else:
#         return {"status4": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Fifth_task")
# async def Check5(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):

#     fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#     for i in fi:
#         if(i == True):
#             fiB = True
#         else:
#             fiB = False
             
#     if ch.answer.lower() == "достоверность" and fiB != True:
#         statement = update(User).where(User.id == user.id).values(fifth_task = True)
#         await session.execute(statement)
#         await session.commit()

#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False 
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False  
        
#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow(), time_result_sec = time())
#             await session.execute(stmt)
#             await session.commit()
#             time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#             for i in time_reg:
#                 time_reg_1 = i
#             time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#             for i in time_res:
#                 time_res_1 = i
#             section = time_res_1 - time_reg_1
#             stmtend = update(User).where(User.id == user.id).values(result_section = section)
#             await session.execute(stmtend)
#             await session.commit()
#         return {"status5": "Верный пароль!!!"}
#     elif ch.answer.lower() != "достоверность":
#         return {"status5": "Неверный пароль!!!"}
#     else:
#         return {"status5": "Верный пароль уже был введен ранее!!!"}
    
# @app.get("/Top_Lenta")
# async def Top_Lenta(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     up = (await session.execute(select(User.id))).all()
#     max = 0
#     for i in up:
#         for item in i:
#             if item > max:
#                 max = item

#     low_limit = 1
#     up_limit = max+1
#     query = select(User.username, User.email, User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id < up_limit, User.id >= low_limit).order_by(User.result_section)
#     task = await session.execute(query)
#     return task.mappings().fetchmany(7)

# @app.get("/Task_Check", response_model=TaskCheck)
# async def Task_Check(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     query = await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))
#     return query.first()
# @app.get("/User_Info", response_model=UserInfo)
# async def User_Info(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     query = await session.execute(select(User.username, User.schoolname, User.email).where(User.id == user.id))
#     return query.first()













# from fastapi import FastAPI, Depends
# from fastapi_users import FastAPIUsers, fastapi_users
# from auth.database import User
# from sqlalchemy.orm import Session
# from auth.auth import auth_backend
# from auth.manager import get_user_manager
# from models.schemas import UserCreate, UserRead
# # from routers.ScoreCheck import router as Score
# from sqlalchemy import insert, select, delete, update
# from fastapi import APIRouter, Depends
# from sqlalchemy.ext.asyncio import AsyncSession
# from auth.database import get_async_session
# from fastapi import APIRouter
# from models.model import User
# from fastapi_users import FastAPIUsers, fastapi_users
# from models.schemas import ScoreCheck, TaskCheck, UserInfo
# from sqlalchemy.orm import joinedload
# from fastapi import HTTPException
# from datetime import datetime
# from time import time
# from sqlalchemy import func
# from sqlalchemy import Column

# app = FastAPI(title = "Cyber-care")

# fastapi_users = FastAPIUsers[User, int](
#     get_user_manager,
#     [auth_backend],
# )

# app.include_router(
#     fastapi_users.get_auth_router(auth_backend),
#     prefix="/auth/jwt",
#     tags=["Auth"],
# )

# app.include_router(
#     fastapi_users.get_register_router(UserRead, UserCreate),
#     prefix="/auth",
#     tags=["Register"],
# )

# current_user = fastapi_users.current_user()

# @app.post("/First_Task")
# async def Check1(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):

#     fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#     for i in fr:
#         if(i == True):
#             frB = True
#         else:
#             frB = False    

#     if ch.answer.lower() == "целостность" and frB != True:
#         statement = update(User).where(User.id == user.id).values(first_task = True)
#         await session.execute(statement)
#         await session.commit()
#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False 
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False 
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False    
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow())
#             await session.execute(stmt)
#             await session.commit()
#         return {"status1": "Верный пароль!!!"}
#     elif ch.answer.lower() != "целостность":
#         return {"status1": "Неверный пароль!!!"}
#     else:
#         return {"status1": "Верный пароль уже был введен ранее!!!"}
    
# @app.post("/Second_task")
# async def Check2(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#     for i in se:
#         if(i == True):
#             seB = True
#         else:
#             seB = False

#     if ch.answer.lower() == "защищенность" and seB != True:
#         statement = update(User).where(User.id == user.id).values(second_task = True)
#         await session.execute(statement)
#         await session.commit()

#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False  
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False 
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False    
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow())
#             await session.execute(stmt)
#             await session.commit()
#         return {"status2": "Верный пароль!!!"}
#     elif ch.answer.lower() != "защищенность":
#         return {"status2": "Неверный пароль!!!"}
#     else:
#         return {"status2": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Third_task")
# async def Check3(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#     for i in th:
#         if(i == True):
#             thB = True
#         else:
#             thB = False 

#     if ch.answer.lower() == "доступность" and thB != True:
#         statement = update(User).where(User.id == user.id).values(third_task = True)
#         await session.execute(statement)
#         await session.commit()

#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False 
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False  
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False    
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow())
#             await session.execute(stmt)
#             await session.commit()
#         return {"status3": "Верный пароль!!!"}
#     elif ch.answer.lower() != "доступность":
#         return {"status3": "Неверный пароль!!!"}
#     else:
#         return {"status3": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Fourth_task")
# async def Check4(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#     for i in fo:
#         if(i == True):
#             foB = True
#         else:
#             foB = False

#     if ch.answer.lower() == "конфиденциальность" and foB != True:
#         statement = update(User).where(User.id == user.id).values(fourth_task = True)
#         await session.execute(statement)
#         await session.commit()
#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False 
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False 
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False     
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow())
#             await session.execute(stmt)
#             await session.commit()
#         return {"status4": "Верный пароль!!!"}
#     elif ch.answer.lower() != "конфиденциальность":
#         return {"status4": "Неверный пароль!!!"}
#     else:
#         return {"status4": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Fifth_task")
# async def Check5(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):

#     fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#     for i in fi:
#         if(i == True):
#             fiB = True
#         else:
#             fiB = False
             
#     if ch.answer.lower() == "достоверность" and fiB != True:
#         statement = update(User).where(User.id == user.id).values(fifth_task = True)
#         await session.execute(statement)
#         await session.commit()

#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False 
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False  
        
#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow())
#             await session.execute(stmt)
#             await session.commit()
#         return {"status5": "Верный пароль!!!"}
#     elif ch.answer.lower() != "достоверность":
#         return {"status5": "Неверный пароль!!!"}
#     else:
#         return {"status5": "Верный пароль уже был введен ранее!!!"}
    
# @app.get("/Top_Lenta")
# async def Top_Lenta(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     up = (await session.execute(select(User.id))).all()
#     max = 0
#     for i in up:
#         for item in i:
#             if item > max:
#                 max = item
                
#     time_reg = (await session.execute(select(User.registered_at_sec).where(User.id == user.id))).first()
#     for i in time_reg:
#         time_reg_1 = i
#     time_res = (await session.execute(select(User.time_result_sec).where(User.id == user.id))).first()
#     for i in time_res:
#         time_res_1 = i
#     section =  time_res_1 - time_reg_1
#     print(section)

#     low_limit = 1
#     up_limit = max+1
#     query = select(User.username, User.email, User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id < up_limit, User.id >= low_limit).order_by(User.time_result)
#     task = await session.execute(query)
#     return task.mappings().fetchmany(7)

# @app.get("/Task_Check", response_model=TaskCheck)
# async def Task_Check(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     query = await session.execute(select(User.first_task, User.second_task, User.third_task, User.fourth_task, User.fifth_task).where(User.id == user.id))
#     return query.first()
# @app.get("/User_Info", response_model=UserInfo)
# async def User_Info(user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
#     query = await session.execute(select(User.username, User.schoolname, User.email).where(User.id == user.id))
#     return query.first()





































# @app.get("/protected-route")
# def protected_route(user: User = Depends(current_user)):
#     return f"Hello, {user.username}"

# @app.get("/unprotected-route")
# def unprotected_route():
#     return f"Hello, anonym"

# @app.post("/First_Task")
# async def Check1(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):

#     fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#     for i in fr:
#         if(i == True):
#             frB = True
#         else:
#             frB = False    

#     if ch.answer.lower() == "целостность":
#         statement = update(User).where(User.id == user.id).values(first_task = True)
#         await session.execute(statement)
#         await session.commit()
#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False 
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False 
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False    
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow())
#             await session.execute(stmt)
#             await session.commit()
#         return {"status1": "Верный пароль!!!"}
#     elif ch.answer.lower() != "целостность":
#         return {"status1": "Неверный пароль!!!"}
#     else:
#         return {"status1": "Верный пароль уже был введен ранее!!!"}
    
# @app.post("/Second_task")
# async def Check2(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#     for i in se:
#         if(i == True):
#             seB = True
#         else:
#             seB = False

#     if ch.answer.lower() == "защищенность" and seB != True:
#         statement = update(User).where(User.id == user.id).values(second_task = True)
#         await session.execute(statement)
#         await session.commit()

#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False  
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False 
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False    
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow())
#             await session.execute(stmt)
#             await session.commit()
#         return {"status2": "Верный пароль!!!"}
#     elif ch.answer.lower() != "защищенность":
#         return {"status2": "Неверный пароль!!!"}
#     else:
#         return {"status2": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Third_task")
# async def Check3(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#     for i in th:
#         if(i == True):
#             thB = True
#         else:
#             thB = False 

#     if ch.answer.lower() == "доступность" and thB != True:
#         statement = update(User).where(User.id == user.id).values(third_task = True)
#         await session.execute(statement)
#         await session.commit()

#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False 
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False  
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False    
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow())
#             await session.execute(stmt)
#             await session.commit()
#         return {"status3": "Верный пароль!!!"}
#     elif ch.answer.lower() != "доступность":
#         return {"status3": "Неверный пароль!!!"}
#     else:
#         return {"status3": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Fourth_task")
# async def Check4(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):
    
#     fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#     for i in fo:
#         if(i == True):
#             foB = True
#         else:
#             foB = False

#     if ch.answer.lower() == "конфиденциальность" and foB != True:
#         statement = update(User).where(User.id == user.id).values(fourth_task = True)
#         await session.execute(statement)
#         await session.commit()
#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False 
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False 
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False     
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False 

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow())
#             await session.execute(stmt)
#             await session.commit()
#         return {"status4": "Верный пароль!!!"}
#     elif ch.answer.lower() != "конфиденциальность":
#         return {"status4": "Неверный пароль!!!"}
#     else:
#         return {"status4": "Верный пароль уже был введен ранее!!!"}

# @app.post("/Fifth_task")
# async def Check5(ch: ScoreCheck, user: User = Depends(current_user), session: AsyncSession = Depends(get_async_session)):

#     fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#     for i in fi:
#         if(i == True):
#             fiB = True
#         else:
#             fiB = False
             
#     if ch.answer.lower() == "достоверность" and fiB != True:
#         statement = update(User).where(User.id == user.id).values(fifth_task = True)
#         await session.execute(statement)
#         await session.commit()

#         fr = (await session.execute(select(User.first_task).where(User.id == user.id))).first()
#         for i in fr:
#             if(i == True):
#                 frB = True
#             else:
#                 frB = False
#         se = (await session.execute(select(User.second_task).where(User.id == user.id))).first()
#         for i in se:
#             if(i == True):
#                 seB = True
#             else:
#                 seB = False
#         th = (await session.execute(select(User.third_task).where(User.id == user.id))).first()
#         for i in th:
#             if(i == True):
#                 thB = True
#             else:
#                 thB = False 
#         fo = (await session.execute(select(User.fourth_task).where(User.id == user.id))).first()
#         for i in fo:
#             if(i == True):
#                 foB = True
#             else:
#                 foB = False
#         fi = (await session.execute(select(User.fifth_task).where(User.id == user.id))).first()
#         for i in fi:
#             if(i == True):
#                 fiB = True
#             else:
#                 fiB = False  

#         if frB == True and seB == True and thB == True and foB == True and fiB == True:
#             stmt = update(User).where(User.id == user.id).values(time_result = datetime.utcnow())
#             await session.execute(stmt)
#             await session.commit()
#         return {"status5": "Верный пароль!!!"}
#     elif ch.answer.lower() != "достоверность":
#         return {"status5": "Неверный пароль!!!"}
#     else:
#         return {"status5": "Верный пароль уже был введен ранее!!!"}
    