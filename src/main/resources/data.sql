INSERT INTO USUARIO(nome, email, senha) VALUES('Aluno', 'aluno@email.com', '123456');

INSERT INTO CURSO(nome, categoria) VALUES('Spring Boot', 'Programação');
INSERT INTO CURSO(nome, categoria) VALUES('HTML 5', 'Front-end');

INSERT INTO TOPICO(titulo, mensagem, data_criacao, status, autor_id, curso_id) VALUES('Dúvida', 'duvida com Spring', '2024-05-10 18:00:00', 'NAO_RESPONDIDO', 1, 1 );
INSERT INTO TOPICO(titulo, mensagem, data_criacao, status, autor_id, curso_id) VALUES('Dúvida2', 'duvida com Java', '2024-05-10 18:00:00', 'NAO_RESPONDIDO', 1, 1 );
INSERT INTO TOPICO(titulo, mensagem, data_criacao, status, autor_id, curso_id) VALUES('Dúvida3', 'duvida com a nuvem', '2024-05-10 18:00:00', 'NAO_RESPONDIDO', 1, 2 );
