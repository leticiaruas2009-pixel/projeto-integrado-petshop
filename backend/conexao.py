import mysql.connector

def conectar():
    """Abre e devolve uma conexão com o banco petshop."""
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",        # no XAMPP a senha do root vem vazia
        database="petshop"
    )

# Este bloco só roda quando você executa este arquivo diretamente.
# Serve para testar se a conexão está funcionando.
if __name__ == "__main__":
    try:
        con = conectar()
        cursor = con.cursor()
        cursor.execute("SELECT nome FROM pet")
        print("Conectado! Pets no banco:", cursor.fetchall())
        cursor.close()
        con.close()
    except mysql.connector.Error as erro:
        print("Erro ao conectar:", erro)