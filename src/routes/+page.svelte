<script lang="ts">
  import { onMount } from 'svelte';
  import { msToTime } from '../lib/utils'

  let timers: Array<{
    start: Date,
    diff: number,
    name: string,
    interval: number,
  }> = []
  let interval = 0

  onMount(() => {
    if (localStorage.length) {
      Object.keys(localStorage).forEach(key => {
        timers = [...timers, JSON.parse(localStorage[key])]
      })
    }
  })

	const updateDate = (timerId: number) => {
    const current = new Date()
    const timer = timers[timerId]
    const start = timer.start
		const diff = (current.getTime() - start.getTime())
    timers[timerId] = {...timer, diff}

    localStorage.setItem(`timer-${timerId}`, `${JSON.stringify(timer)}`)
	}

  const startTimer = (id: number | void) => {
    const isNew = id === undefined
    const timerId = isNew ? timers.length : id
    const timer = timers[timerId]

    if (interval) {
      window.clearInterval(interval);
    }

    const start = new Date()
    interval = window.setInterval(() => updateDate(timerId), 1000)

    if (isNew) {
      timers = [...timers, {
        start,
        diff: 0,
        name: '',
        interval,
      }]
    } else {
      const newStart = new Date(start.getTime() - timer.diff)
      timer.start = newStart
      timer.interval = interval
    }
    
    updateDate(timerId)
  }

  const removeAll = () => {
    localStorage.clear()
    timers = []
  }

  const stopTimer = () => {
    window.clearInterval(interval)
    interval = 0
  }
</script>

<main>
  <h1>Simple Timer</h1>

  {#if timers.length}
    <div class="timers">
      {#each timers as timer, id}
        <div class="timer">
          {msToTime(timer.diff)}
          <input data-timer-id={id} type="text" name="" id="" bind:value={timer.name} placeholder="Name" />
          {#if interval === timer.interval}
            <button data-timer-id={id} on:click={stopTimer}>Stop</button>
          {:else}
            <button data-timer-id={id} on:click={() => startTimer(id)}>Resume</button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <p>
    <button on:click={() => startTimer()}>Start new timer</button>
    <button on:click={removeAll}>Delete all</button>
  </p>
</main>