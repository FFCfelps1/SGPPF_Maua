from app.core.database import SessionLocal, engine, Base
from app.models.usuario import Usuario
from app.models.pesquisador import Pesquisador
from app.models.projeto import Projeto
from app.models.publicacao import Publicacao
from app.models.orientacao import Orientacao
from app.models.financiamento import Financiamento
from datetime import datetime
from app.core.security import get_password_hash

def seed():
    # Reiniciar o banco para garantir que os IDs comecem do 1
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Limpando e populando banco de dados...")
        
        # 1. Criar Usuário e Pesquisador
        hashed_pwd = get_password_hash("maua123")
        user = Usuario(
            nome="Vanderlei C. Parro", 
            email="vanderlei.cp@maua.br", 
            perfil="Pesquisador", 
            instituicao_id="IMT-001",
            hashed_password=hashed_pwd
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        pesq = Pesquisador(
            usuario_id=user.id, 
            departamento="Engenharia Elétrica", 
            area_atuacao="Automação", 
            orcid="0000-0002-1234-5678",
            lattes_url="http://lattes.cnpq.br/1234567890"
        )
        db.add(pesq)
        db.commit()
        db.refresh(pesq)

        # 2. Criar Projeto
        proj = Projeto(
            titulo="Sistema de Monitoramento IoT para Eficiência Energética",
            codigo_projeto="PRJ-2024-001",
            agencia_financiadora="FAPESP",
            modalidade="Auxílio Regular",
            pesquisador_responsavel_id=pesq.id,
            status="Em Andamento",
            valor_aprovado=185000.0,
            data_inicio=datetime(2024, 1, 15)
        )
        db.add(proj)
        db.commit()
        db.refresh(proj)
        
        # 3. Criar Publicação
        pub = Publicacao(
            titulo="IoT-based Energy Monitoring System: A Comprehensive Framework",
            doi="10.1016/j.enbuild.2024.001",
            ano=2024,
            tipo="Artigo",
            periodico="Energy and Buildings",
            fator_impacto=7.2,
            area_conhecimento="Engenharia Elétrica"
        )
        db.add(pub)

        # 4. Criar Orientação
        orient = Orientacao(
            aluno="Lucas M. Ribeiro",
            nivel="Mestrado",
            titulo_trabalho="Aprendizado por Reforço em Sistemas de Controle",
            orientador_id=pesq.id,
            status="Em Andamento",
            data_inicio=datetime(2023, 3, 1)
        )
        db.add(orient)

        # 5. Criar Financiamento
        fin = Financiamento(
            projeto_id=proj.id,
            agencia="FAPESP",
            valor_aprovado=185000.0,
            valor_recebido=92500.0,
            status="Vigente",
            data_inicio=datetime(2024, 1, 15)
        )
        db.add(fin)

        db.commit()
        print("Dados iniciais inseridos com sucesso!")
    except Exception as e:
        print(f"Erro ao popular banco: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
