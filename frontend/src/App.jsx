import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL
const FIRSTNAME_PATTERN = /^\p{L}[\p{L}'’ -]*$/u

function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [reloadKey, setReloadKey] = useState(0)
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState('')
  const [assignee, setAssignee] = useState('')
  const [assigneeError, setAssigneeError] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTasks() {
      try {
        const url = filter === 'all'
          ? `${API_URL}/tasks`
          : `${API_URL}/tasks?status=${filter}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error()
        }
        const data = await response.json()
        setTasks(data.tasks ?? data.filteredTasks)
        setError('')
      } catch {
        setError("Impossible de charger les tâches. L'API est peut-être arrêtée.")
      }
    }
    loadTasks()
  }, [filter, reloadKey])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) {
      setTitleError('Le titre est obligatoire.')
      return
    }
    setTitleError('')
    const firstName = assignee.trim()
    if (firstName && !FIRSTNAME_PATTERN.test(firstName)) {
      setAssigneeError('Saisissez uniquement un prénom, sans chiffre ni @.')
      return
    }
    setAssigneeError('')
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, assignee: firstName }),
      })
      if (!response.ok) {
        throw new Error()
      }
      setTitle('')
      setAssignee('')
      setError('')
      setMessage('Tâche ajoutée.')
      setReloadKey((key) => key + 1)
    } catch {
      setMessage('')
      setError("Impossible d'ajouter la tâche.")
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}/completed`, {
        method: 'PATCH',
      })
      if (!response.ok) {
        throw new Error()
      }
      setError('')
      setMessage(`Statut de la tâche « ${task.title} » modifié.`)
      setReloadKey((key) => key + 1)
    } catch {
      setMessage('')
      setError('Impossible de modifier la tâche.')
    }
  }

  async function removeAssignee(task) {
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}/assignee`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error()
      }
      setError('')
      setMessage(`Bénévole retiré de la tâche « ${task.title} ».`)
      setReloadKey((key) => key + 1)
    } catch {
      setMessage('')
      setError('Impossible de retirer le bénévole.')
    }
  }

  async function deleteTask(task) {
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error()
      }
      setError('')
      setMessage(`Tâche « ${task.title} » supprimée.`)
      setReloadKey((key) => key + 1)
    } catch {
      setMessage('')
      setError('Impossible de supprimer la tâche.')
    }
  }

  return (
    <>
      <header>
        <h1>Gestion des tâches</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="task-title">Titre de la tâche</label>
          <input
            id="task-title"
            type="text"
            value={title}
            maxLength={255}
            onChange={(event) => setTitle(event.target.value)}
            aria-describedby={titleError ? 'title-error' : undefined}
            aria-invalid={titleError ? 'true' : undefined}
          />
          {titleError && <p id="title-error">{titleError}</p>}

          <label htmlFor="task-assignee">Prénom du bénévole (facultatif)</label>
          <input
            id="task-assignee"
            type="text"
            value={assignee}
            maxLength={50}
            onChange={(event) => setAssignee(event.target.value)}
            aria-describedby={
              assigneeError ? 'assignee-error privacy-notice' : 'privacy-notice'
            }
            aria-invalid={assigneeError ? 'true' : undefined}
          />
          {assigneeError && <p id="assignee-error">{assigneeError}</p>}

          <button type="submit">Ajouter la tâche</button>
        </form>

        <p id="privacy-notice" className="privacy">
          L’association collecte le prénom saisi uniquement pour savoir quel
          bénévole s’occupe de la tâche. Il est conservé tant que la tâche
          existe et supprimé en même temps qu’elle. Pour le faire retirer plus
          tôt, utilisez le bouton « Retirer le bénévole » ou écrivez à{' '}
          <a href="mailto:contact@association.example">
            contact@association.example
          </a>
          .
        </p>

        <p role="status">{message}</p>
        <p role="alert">{error}</p>

        <label htmlFor="task-filter">Afficher</label>
        <select
          id="task-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">Toutes</option>
          <option value="completed">Complétées</option>
          <option value="uncompleted">Non complétées</option>
        </select>

        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                checked={task.isCompleted}
                onChange={() => toggleTask(task)}
              />
              <label htmlFor={`task-${task.id}`}>{task.title}</label>
              {task.assignee && (
                <>
                  <span className="assignee">Bénévole : {task.assignee}</span>
                  <button
                    type="button"
                    onClick={() => removeAssignee(task)}
                    aria-label={`Retirer le bénévole ${task.assignee} de la tâche ${task.title}`}
                  >
                    Retirer le bénévole
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => deleteTask(task)}
                aria-label={`Supprimer la tâche ${task.title}`}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default App