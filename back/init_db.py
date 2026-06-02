from app.core.database import engine, Base
# Importar todos os modelos para garantir que sejam registrados
from app.models.usuario import Usuario
from app.models.pesquisador import Pesquisador
from app.models.grupo import Grupo
from app.models.projeto import Projeto
from app.models.publicacao import Publicacao
from app.models.orientacao import Orientacao
from app.models.financiamento import Financiamento
from app.models.associativas import AutoresPublicacoes, ProjetoPublicacao, GrupoPesquisador

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    print("Inicializando banco de dados SQLite...")
    init_db()
    print("Banco de dados inicializado com sucesso.")
