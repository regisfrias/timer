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
  let total = 0

  onMount(() => {
    if (localStorage.length) {
      Object.keys(localStorage).forEach(key => {
        timers = [...timers, JSON.parse(localStorage[key])]
      })
      total = timers.reduce((prev, timer) => prev + timer.diff, 0)
    }
  })

	const updateDate = (timerId: number) => {
    const current = new Date()
    const timer = timers[timerId]
    const start = timer.start
		const diff = (current.getTime() - start.getTime())
    timers[timerId] = {...timer, diff}

    localStorage.setItem(`timer-${timerId}`, `${JSON.stringify(timer)}`)

    total = timers.reduce((prev, timer) => prev + timer.diff, 0)
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

  const onNameChange = (evt: Event) => {
    const target = (evt.target as HTMLInputElement)
    const timerId = target.dataset.timerId ? parseInt(target.dataset.timerId) : 0
    const timer = timers[timerId]
    timer.name = target.value
    localStorage.setItem(`timer-${timerId}`, `${JSON.stringify(timer)}`)
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
          <input data-timer-id={id} type="text" name="" id="" bind:value={timer.name} on:keyup={onNameChange} placeholder="Timer name" />
          {#if interval === timer.interval}
            <button class="play_pause" data-timer-id={id} on:click={stopTimer}>■</button>
          {:else}
            <button class="play_pause" data-timer-id={id} on:click={() => startTimer(id)}>►</button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <p>
    <button on:click={() => startTimer()}>Start new timer</button>
    <button on:click={removeAll}>Delete all</button>
  </p>

  <p>{msToTime(total)}</p>
</main>

<style>
  .timer {
    display: flex;
    margin: 0.2rem;
    align-items: center;
    justify-content: space-between;
  }

  .timer input {
    display: block;
    min-height: 1.6rem;
    line-height: 1;
    margin: 0;
    padding: 0.2rem;
    border: 1px solid transparent;
    background-color: rgb(248, 248, 248);
  }

  .timer input:focus {
    outline: 0;
    border: 1px solid rgb(208, 208, 208);
    background-color: rgb(239, 239, 239);
  }

  button {
    height: 2rem;
    border: 0;
    background-color: rgb(160, 197, 230);
  }

  .play_pause {
    font-size: 1rem;
    line-height: 1;
    width: 2rem;
  }
</style>
