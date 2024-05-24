import { Usuario } from './usuario.model';
describe('Usuario Model', () => {
  const usuarioTest = new Usuario(['pcbdrta1']);
  it('Testando uma instancia.', () => {
    expect(usuarioTest).toBeTruthy();
  });

  it('get funcionario.', () => {
    expect(usuarioTest.funcionario).toBeUndefined();
  });

  it('get acessos.', () => {
    expect(usuarioTest.acessos).toEqual(['pcbdrta1']);
  });

  it('Deve poder consultar', () => {
    expect(usuarioTest.podeConsultar()).toBeTrue();
  });

  it('Não deve poder consultar', () => {
    expect(usuarioTest.podeAdministrar()).toBeFalse();
  });
});
