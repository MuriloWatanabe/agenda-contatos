'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, Contact, PagedResult } from '@/lib/api';
import ContactModal from '@/components/ContactModal';
import DeleteModal from '@/components/DeleteModal';

export default function ContactsPage() {
  const [data, setData] = useState<PagedResult<Contact> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  const loadContacts = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getContacts(p);
      setData(result);
    } catch {
      setError('Não foi possível carregar os contatos. Verifique se a API está disponível.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts(page);
  }, [page, loadContacts]);

  const handleSave = async (name: string, phone: string) => {
    if (editContact) {
      await api.updateContact(editContact.id, name, phone);
    } else {
      await api.createContact(name, phone);
    }
    setModalOpen(false);
    setEditContact(null);
    loadContacts(page);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.deleteContact(deleteTarget.id);
    setDeleteTarget(null);
    const isLastOnPage = data?.items.length === 1 && page > 1;
    const targetPage = isLastOnPage ? page - 1 : page;
    if (isLastOnPage) setPage(targetPage);
    else loadContacts(targetPage);
  };

  const openCreate = () => {
    setEditContact(null);
    setModalOpen(true);
  };

  const openEdit = (contact: Contact) => {
    setEditContact(contact);
    setModalOpen(true);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agenda de Contatos</h1>
            {data && !loading && (
              <p className="text-sm text-gray-500 mt-0.5">
                {data.totalCount} {data.totalCount === 1 ? 'contato cadastrado' : 'contatos cadastrados'}
              </p>
            )}
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Contato
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Erro ao carregar</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">{error}</p>
              <button
                onClick={() => loadContacts(page)}
                className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : loading ? (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-2/5" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-20 hidden sm:block" />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                    <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Nenhum contato cadastrado</p>
              <p className="text-sm text-gray-500 mt-1">Clique em &quot;Novo Contato&quot; para começar.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Telefone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Cadastrado em
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.items.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-semibold text-indigo-600">
                                {contact.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{contact.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-400 hidden sm:table-cell">
                          {formatDate(contact.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(contact)}
                              title="Editar"
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteTarget(contact)}
                              title="Excluir"
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-sm text-gray-500 order-2 sm:order-1">
                    Mostrando{' '}
                    <span className="font-medium text-gray-700">
                      {(page - 1) * data.pageSize + 1}–{Math.min(page * data.pageSize, data.totalCount)}
                    </span>{' '}
                    de{' '}
                    <span className="font-medium text-gray-700">{data.totalCount}</span> contatos
                  </p>
                  <div className="flex items-center gap-1 order-1 sm:order-2">
                    <button
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Anterior
                    </button>
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - page) <= 1)
                      .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                        if (idx > 0 && (arr[idx - 1] as number) + 1 < p) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === '...' ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => setPage(item as number)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              item === page
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === data.totalPages}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Próximo →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {modalOpen && (
        <ContactModal
          contact={editContact}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditContact(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
